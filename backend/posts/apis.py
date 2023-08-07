# DRF imports
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response

# Local imports
from .models import Post, Comment, Like
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
        Instantiates and returns the list of permission that this view requires.
        """
        if self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [IsOwnerOrReadOnly]
        else:
            permission_classes = [IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def followed(self, request, *args, **kwargs):
        user = request.user
        following_users = user.following.all()
        followed_posts = Post.objects.filter(user__in=following_users).order_by('-created_at')
        serializer = self.get_serializer(followed_posts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def like(self, request, *args, **kwargs):
        user = request.user
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=user, post=post)

        if not created:
            like.delete()
            return Response({"message": "Post unliked"})

        return Response({"message": "Post liked"})

    @action(detail=True, methods=['post'])
    def comment(self, request, *args, **kwargs):
        user = request.user
        post = self.get_object()

        text = request.data.get('text', '').strip()

        if not text:
            return Response({"error": "Comment text is required."})

        Comment.objects.create(user=user, post=post, text=text)

        return Response({"message": "Comment added."})

