from .models import Roles
from rest_framework import viewsets, permissions
from .serializers import RoleSerializer

class RoleViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Roles.objects.all().order_by('-date_joined')
    serializer_class = RoleSerializer
    permission_classes = [permissions.AllowAny]