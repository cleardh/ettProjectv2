from django.shortcuts import render
from django import forms
from .forms import OrgForm
from .models import UserOrg
from backend.decorators import unauthenticated_user, allowed_users

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UsrOrgSerializer
from .models import UserOrg

@unauthenticated_user
@allowed_users(allowed_roles=['admin'])
def org_create_view(request):
    form = OrgForm(request.POST or None)
    if form.is_valid():
        form.save()

    context = {
        'form': form
        }

    return render(request, "orgs.html", context)

class UsrOrgView(APIView):
    def get(self, request):
        uo = UserOrg.objects.all()
        serializer = UsrOrgSerializer(uo, many=True)
        return Response(serializer.data)