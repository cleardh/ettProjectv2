from django.db import models
from django.conf import settings


class Roles(models.Model):
    class Meta:
        verbose_name_plural = "Roles"
    RoleID        = models.AutoField(primary_key=True, null=False)
    title         = models.CharField(max_length=30, null=True)
    isAdmin       = models.BooleanField(default=False)

    def __str__(self):
        return str(self.title)