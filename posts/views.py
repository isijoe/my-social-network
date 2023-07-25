from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.http import Http404


from .models import Post


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


# Define a create view for creating new Post objects.
# This view requires that the user be logged in.
class PostCreateView(LoginRequiredMixin, CreateView):
    model = Post
    template_name = 'posts/post_new.html'
    fields = ['image', 'caption']

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)
    

# Define an edit view for updating existing Post objects.
# This view requires that the user be logged in.
class PostEditView(LoginRequiredMixin, UpdateView):
    model = Post
    template_name = 'posts/post_edit.html'
    fields = ['image', 'caption']

    def dispatch(self, request, *args, **kwargs):
        obj = self.get_object()
        if obj.user != self.request.user:
            raise Http404("You are not allowed to edit this Post")
        return super().dispatch(request, *args, **kwargs)
