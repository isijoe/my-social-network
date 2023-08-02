# DRF imports
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# Local imports
from .models import Post
from .serializers import PostSerializer
from .permissions import IsOwnerOrReadOnly


class PostViewSet(viewsets.ModelViewSet):
    """
    API viewset for viewing, creating, updating and deleting post instances.
    Only authenticated users can perform actions.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def get_permissions(self):
        """
        Instantiates and returns the lsit of permission that this view requires.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
