from io import BytesIO
from PIL import Image
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import Post


def create_dummy_image(filename):
    """Create a dummy image for testing."""
    file = BytesIO()
    image = Image.new('RGBA', size=(50, 50), color=(155, 0, 0))
    image.save(file, 'png')
    file.name = f'{filename}.png'
    file.seek(0)
    return SimpleUploadedFile(file.name, file.read(), content_type='image/png')


class PostTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        """Setup for test data."""
        cls.user1 = get_user_model().objects.create_user(
            username='dummy1',
            email='dummy1@email.com',
            password='dummypass123',
        )
        cls.user2 = get_user_model().objects.create_user(
            username='dummy2',
            email='dummy2@email.com',
            password='dummypass123',
        )
        cls.post1 = Post.objects.create(
            user=cls.user1,
            caption='post1',
            image=create_dummy_image('post1'),
        )
        cls.post2 = Post.objects.create(
            user=cls.user2,
            caption='post2',
            image=create_dummy_image('post2'),
        )

    def test_post_list_view(self):
        """Test post list view."""
        response = self.client.get(reverse('post_list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, self.post1.get_image_url())
        self.assertContains(response, self.post2.get_image_url())

    def test_post_detail_view(self):
        """Test post detail view."""
        response = self.client.get(self.post1.get_absolute_url())
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'post1')

    def test_post_create_view(self):
        """Test post create view."""
        self.client.login(email='dummy1@email.com', password='dummypass123')
        response = self.client.post(reverse('post_new'), {
            'caption': 'new post',
            'image': create_dummy_image('newpost'),
        })
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Post.objects.filter(caption='new post').exists())

    def test_post_edit_view(self):
        """Test post edit view."""
        self.client.login(username='dummy1', password='dummypass123')
        response = self.client.post(self.post1.get_edit_url(), {
            'caption': 'edited post',
            'image': create_dummy_image('edited-post'),
        })
        self.assertEqual(response.status_code, 302)
        self.post1.refresh_from_db()
        self.assertEqual(self.post1.caption, 'edited post')

    def test_post_edit_view_denied(self):
        """Test post edit view access denied."""
        self.client.login(username='dummy2', password='dummypass123')
        response = self.client.post(self.post1.get_edit_url(), {
            'caption': 'edited post',
            'image': create_dummy_image('edited-post-denied'),
        })
        self.assertEqual(response.status_code, 404)
