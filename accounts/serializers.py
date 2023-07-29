# Django imports
from django.contrib.auth import get_user_model

# DRF imports
from rest_framework import serializers

# Local imports
from posts.serializers import PostSerializer

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomUser model.
    Includes related posts.
    """
    post_set = PostSerializer(many=True, read_only=True)
    # Show username instead of id
    # following = serializers.StringRelatedField(many=True)
    # followers = serializers.StringRelatedField(many=True)
    # If username is unique, use the more efficient SlugRelatedField
    following = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')
    followers = serializers.SlugRelatedField(many=True, read_only=True, slug_field='username')
    
    class Meta:
        model = get_user_model()
        fields = [
            'id',
            'username',
            'email',
            'bio',
            'following',
            'followers',
            'post_set',
        ]
