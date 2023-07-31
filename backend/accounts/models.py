import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.urls import reverse


def upload_to(instance, filename):
    """Generate file path for profile picture."""
    return 'profile_pictures/{}.{}'.format(uuid.uuid4(), filename.split('.')[-1])

def default_place_pics():
    return 'profile_pictures/def_prof_pic.jpg'

# Define a custom user model with a UUID primary key and additional profile picture and bio fields.
class CustomUser(AbstractUser):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    profile_picture = models.ImageField(upload_to=upload_to, null=True, blank=True, default=default_place_pics)
    bio = models.TextField(blank=True)
    following = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True) # symmetrical false necesseray because user1 following user2 does not mean user2 is following user1

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        """Get URL for user's detail view."""
        return reverse('profile_detail', kwargs={'pk': self.pk})

    def get_profile_picture_url(self):
        """Get URL for user's profile picture."""
        if self.profile_picture and hasattr(self.profile_picture, 'url'):
            return self.profile_picture.url
