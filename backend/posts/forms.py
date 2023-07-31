from django import forms
from django.forms import inlineformset_factory

from .models import Post, PostImage, Comment, Like

class PostForm(forms.ModelForm):

    class Meta:
        model = Post
        fields = '__all__'


# class PostImageForm(forms.ModelForm):

#     class Meta:
#         model = PostImage
#         fields = ['image']
#         widgets = {
#             'image': forms.ClearableFileInput(attrs={'multiple': True}),
#         }


PostImageFormSet = inlineformset_factory(
    Post, PostImage, fields=('image',), extra=1,
    widgets={'image': forms.ClearableFileInput(attrs={'allow_multiple_selected': True})})

class CommentForm(forms.ModelForm):

    class Meta:
        model = Comment
        fields = ['text']


class LikeForm(forms.ModelForm):

    class Meta:
        model = Like
        fields = []
