from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, UpdateView
from django.views import View
# from django.urls import reverse

from posts.models import Post


# Define a list view for UserProfile objects.
class UserProfileListView(ListView):
    model = get_user_model()
    context_object_name = 'profile_list'
    template_name = 'account/profile_list.html'

    def get_queryset(self):
        return get_user_model().objects.exclude(pk=self.request.user.pk)


# Define a detail view for a single UserProfile object.
class UserProfileDetailView(DetailView):
    model = get_user_model()
    context_object_name = 'profile'
    template_name = 'account/profile_detail.html'

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super().get_context_data(**kwargs)
        # Add in ther user's posts
        context['user_posts'] = Post.objects.filter(user=self.object) 
        return context

    # Uncomment the following method if you want each user to see only his own profile
    # def get_object(self, queryset=None):
    #     return self.request.user # return the logged in user, so each user can see only his own profile


# Define an edit view for updating existing UserProfile objects.
# This view requires that the user be logged in.
class UserProfileEditView(LoginRequiredMixin, UpdateView):
    model = get_user_model()
    template_name = 'account/profile_edit.html'
    fields = ['username', 'email', 'first_name', 'last_name', 'bio','profile_picture']

    # Return the logged in user, so each user can edit only his own profile
    def get_object(self, queryset=None):
        return self.request.user 

    ## uncomment when not using get_absoulut_url in model
    # def get_sucess_url(self):
    #     return reverse('user_profile', kwargs={'pk': self.request.user.pk})


class UserProfileFollowView(LoginRequiredMixin, View):
    def post(self, request, *args, **kwargs):
        # Get the user that the current user wants to follow
        target_user = get_object_or_404(get_user_model(), pk=kwargs['pk'])

        # Prevent users from following themselves
        if request.user == target_user:
            return redirect('profile_detail', pk=target_user.pk)

        # Temporary solution to unfollow without extra view
        # Save amout of th current user's following before target user add
        cnt = request.user.following.count()

        # Add the target user to the current user's following
        request.user.following.add(target_user)

        # Check if amount of follower is the same as before target user add
        if request.user.following.count() == cnt:
            # Remove the target user from the current user's following
            request.user.following.remove(target_user)

        # Redirect back to the target user's profile
        return redirect('profile_detail', pk=target_user.pk)

