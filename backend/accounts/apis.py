# Django imports
from django.contrib.auth import get_user_model

# DRF imports
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

# Local imports
from .serializers import UserSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    """
    API viewset for viewing and editing user instances.
    """
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

    def get_queryset(self):
        # Exclude the authenticated user from the returned query
        return get_user_model().objects.exclude(pk=self.request.user.pk)

    @action(detail=True, methods=['post'])
    def follow(self, request, pk=None):
        # Get the user who is making the request
        user = request.user

        # Get the user to follow
        to_follow = self.get_object()

        if user.following.filter(pk=to_follow.pk).exists():
            user.following.remove(to_follow)
        else:
            # Add the 'to_follow' user to the 'following' list of the current user
            user.following.add(to_follow)

        # Save the user
        user.save()

        # Serialize and return the updated user
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def is_following(self, request, pk=None):
        # Get the user who is making the request
        user = request.user

        # Get the user to check
        to_check = self.get_object()

        # Check if the 'to_check' user is in the 'following' list of the current user
        if user.following.filter(pk=to_check.pk).exists():
            return Response({'isFollowing': True})
        else:
            return Response({'isFollowing': False})

