from django.contrib import admin

from .models import Post, PostImage

# Register your models here.
class PostImageInline(admin.TabularInline):
    model = PostImage

class PostAdmin(admin.ModelAdmin):
    inlines = [PostImageInline,]
    list_display = ['user', 'caption', 'created_at']

admin.site.register(Post, PostAdmin)

