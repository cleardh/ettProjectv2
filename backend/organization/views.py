from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import OrganizationSerializer
from .models import Organization

class OrganizationView(APIView):
    def get(self, request):
        orgs = Organization.objects.all()
        serializer = OrganizationSerializer(orgs, many=True)
        return Response(serializer.data)