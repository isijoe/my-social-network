# Django imports
from django.contrib.auth import get_user_model

# DRF imports
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Local imports
from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly


class PostList(generics.ListCreateAPIView):
    """
    API view to retrieve list of posts or create new post.
    Only authenticated users can create new posts.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly, # If user is authenticated, read and write permissions are allowed
    ]


class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update or delete a post.
    Only the owner of the post can perform actions.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [
        # IsAuthenticatedOrReadOnly, 
        IsOwnerOrReadOnly # If user is owner, read and write permissions are allowed
    ]
