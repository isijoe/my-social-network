from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse, resolve


# Create your tests here.
class CustomUserTests(TestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='dummy',
            email='dummy@email.com',
            password='dummypass123',
        )
        self.admin_user = get_user_model().objects.create_superuser(
            username='admin',
            email='admin@email.com',
            password='adminpass123',
        )

    def test_create_user(self):
        self.assertEqual(self.user.username, 'dummy')
        self.assertEqual(self.user.email, 'dummy@email.com')
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
        self.assertNotEqual(self.user.password, 'dummypass123')

    def test_create_superuser(self):
        self.assertEqual(self.admin_user.username, 'admin')
        self.assertEqual(self.admin_user.email, 'admin@email.com')
        self.assertTrue(self.admin_user.is_active)
        self.assertTrue(self.admin_user.is_staff)
        self.assertTrue(self.admin_user.is_superuser)
        self.assertNotEqual(self.admin_user.password, 'adminpass123')

class SignupPageTests(TestCase):

    def setUp(self):
        self.username = 'newuser'
        self.email = 'newuser@email.com'
        self.url = reverse('account_signup')
        self.response = self.client.get(self.url)

    def test_signup_template(self):
        self.assertEqual(self.response.status_code, 200)
        self.assertTemplateUsed(self.response, 'account/signup.html')
        self.assertContains(self.response, 'Sign Up')
        self.assertNotContains(self.response, 'This should not be here.')

    def test_signup_form(self):
        new_user = get_user_model().objects.create_user(self.username, self.email)
        self.assertEqual(get_user_model().objects.all().count(), 1)
        self.assertEqual(get_user_model().objects.all()[0].username, self.username)
        self.assertEqual(get_user_model().objects.all()[0].email, self.email)

    def test_signup_form_rejects_invalid(self):
        response = self.client.post(self.url, data={})
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'account/signup.html')
        self.assertContains(response, 'This field is required.')

    def test_signup_form_redirects_on_success(self):
        response = self.client.post(self.url, data={
            'email': 'dummy@email.com',
            'password1': 'testpass123',
        })
        self.assertRedirects(response, reverse('home'))


