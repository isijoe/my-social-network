# Django imports
from django.db import transaction

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
    comment_set = CommentSerializer(many=True, required=False)
    like_set = LikeSerializer(many=True, required=False)

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

    # rolls back all transactions, so if an error occurs after second PostImage 
    # is created succesfully, both will be removed as well
    @transaction.atomic
    def create(self, validated_data):
        post_imgs_data = validated_data.pop('post_imgs')
        post = Post.objects.create(**validated_data)
        for post_img_data in post_imgs_data:
            PostImage.objects.create(post=post, **post_img_data)
        return post
