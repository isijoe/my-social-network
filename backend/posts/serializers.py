# DRF imports
from rest_framework import serializers

# Local imports
from .models import Comment, Like, Post, PostImage


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for Comment model.
    """
    user = serializers.StringRelatedField(many=False) # Represent the user as a string

    class Meta:
        model = Comment
        fields = ['user', 'text']


class LikeSerializer(serializers.ModelSerializer):
    """
    Serializer for Like model.
    """
    user = serializers.StringRelatedField(many=False) # Represent the user as a string

    class Meta:
        model = Like
        fields = ['user']


class PostImageSerializer(serializers.ModelSerializer):
    """
    Serializer for PostImage model.
    """

    class Meta:
        model = PostImage
        fields = ['image']


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for Post model.
    Includes related comments and likes.
    """
    user = serializers.StringRelatedField(many=False) # Represent the user as a string
    post_imgs = PostImageSerializer(many=True)
    comment_set = CommentSerializer(many=True)
    like_set = LikeSerializer(many=True)

    class Meta:
        model = Post
        fields = [
            'id',        
            'user',        
            'caption',        
            'created_at',        
            'post_imgs',
            'comment_set',
            'like_set',
        ]