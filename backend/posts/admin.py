from django.contrib import admin

from .models import Post, PostImage, Like

# Register your models here.
class LikeInline(admin.TabularInline):
    model = Like

class PostImageInline(admin.TabularInline):
    model = PostImage

class PostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline, LikeInline,]
    list_display = ['user', 'caption', 'created_at']

admin.site.register(Post, PostAdmin)

