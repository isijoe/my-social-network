# Django imports
from django.contrib.auth import get_user_model

# DRF imports
from rest_framework import generics

# Local imports
from .serializers import UserSerializer


class UserProfileList(generics.ListAPIView):
    """
    API view to retrieve a list of user profiles.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer

    # Override the get_queryset method to exclude the authenticated user from the returned query set
    def get_queryset(self):
        return get_user_model().objects.exclude(pk=self.request.user.pk)


class UserProfileDetail(generics.RetrieveAPIView):
    """
    API view to retrieve a user profile.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
