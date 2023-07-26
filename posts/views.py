from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect, get_object_or_404
from django.urls import reverse_lazy
from django.http import Http404
from django.views import View
from django.views.generic import (
    ListView, 
    DetailView, 
    CreateView, 
    UpdateView, 
    DeleteView
)

from .forms import CommentForm, LikeForm, PostImageFormSet
from .models import Comment, Like, Post


# Define a list view for Post objects.
class PostListView(ListView):
    model = Post
    context_object_name = 'post_list'
    template_name = 'posts/post_list.html'


# Define a detail view for a single Post object.
class PostDetailView(DetailView):
    model = Post
    context_object_name = 'post'
    template_name = 'posts/post_detail.html'

    def get_context_data(self, **kwargs):
        # Overriding the method to add extra context data
        context = super().get_context_data(**kwargs)
        context.update({
            'comments': Comment.objects.filter(post=self.object),
            'likes': Like.objects.filter(post=self.object),
            'comment_form': CommentForm,
            'like_form': LikeForm
        })
        return context


# Define a create view for creating new Post objects.
# This view requires that the user be logged in.
class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    template_name = 'posts/post_new.html'
    fields = ['caption']
    success_url = '/posts/'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.POST:
            # If it is POST, a formset is created with the posted data
            context['formset'] = PostImageFormSet(self.request.POST, self.request.FILES)
        else:
            # If it is not POST, an empty formset is created
            context['formset'] = PostImageFormSet()
        return context

    def form_valid(self, form):
        # Overriding the method to associate the form's user with the current user
        context = self.get_context_data()
        formset = context['formset']
        form.instance.user = self.request.user
        if formset.is_valid():
            self.object = form.save()
            formset.instance = self.object
            formset.save()
            return redirect(self.success_url)
        return self.render_to_response(self.get_context_data(form=form))
        # return super().form_valid(form)
    

# Define an edit view for updating existing Post objects.
# This view requires that the user be logged in.
class PostEditView(LoginRequiredMixin, UpdateView):
    model = Post
    template_name = 'posts/post_edit.html'
    fields = ['caption']

    def get_context_data(self, **kwargs):
        context = super(PostEditView, self).get_context_data(**kwargs)
        if self.request.POST:
            context['formset'] = PostImageFormSet(
                self.request.POST, self.request.FILES, instance=self.object
            )
        else:
            context['formset'] = PostImageFormSet(instance=self.object)
        return context

    def form_valid(self, form):
        context = self.get_context_data()
        formset = context['formset']
        if formset.is_valid():
            self.object = form.save()
            formset.instance = self.object
            formset.save()
            return super().form_valid(form)
        return super().form_invalid(form)

    def dispatch(self, request, *args, **kwargs):
        # Overriding the method to restrict unauthorized users from editing a post
        obj = self.get_object()
        if obj.user != self.request.user:
            raise Http404("You are not allowed to edit this Post")
        return super().dispatch(request, *args, **kwargs)


# Define a delete view for deleting existing Post objects.
# This view requires that the user be logged in.
class PostDeleteView(LoginRequiredMixin, DeleteView):
    model = Post
    template_name = 'posts/post_delete.html'
    success_url = reverse_lazy('post_list')


# Define a view for creating comments to existing Post objects.
# This view requires that the user be logged in.
class PostCommentView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        form = CommentForm(request.POST)
        post = get_object_or_404(Post, pk=kwargs['pk'])
        if form.is_valid():
            comment = form.save(commit=False)
            comment.user = request.user
            comment.post = post
            comment.save()
        return redirect(post.get_absolute_url())  # redirect back to the post detail view


# Define a view for creating likes to existing Post objects.
# This view requires that the user be logged in.
class PostLikeView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        form = LikeForm(request.POST)
        post = get_object_or_404(Post, pk=kwargs['pk'])
        if form.is_valid():
            like, created = Like.objects.get_or_create(user=request.user, post=post)
            if not created:
                like.delete()  # remove like if it already exists
        return redirect(post.get_absolute_url())  # redirect back to the post detail view
