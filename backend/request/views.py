from django.shortcuts import render, get_object_or_404
from .models import Request
from .forms import RequestForm
from django.contrib.auth.models import User
from category.models import Category
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RequestSerializer
from .models import Request

def requestView(request):
    form = RequestForm(request.POST or None)
    if form.is_valid():
        new_request = Request(
            user = request.user,
            dateS = request.POST['dateS'],
            dateE = request.POST['dateE'],
            category = Category(request.POST['category']),
            )
        new_request.save()

    context = {
        'form': form
        }

    return render(request, "request.html", context)

def requestListView(request):
    requests = Request.objects.filter(isConfirmed=False)
    context = {
        'requests': requests
        }

    return render(request, "requests.html", context)

def approvedRequests(request):
    requests = Request.objects.filter(isConfirmed=True)
    context = {
        'requests': requests
        }

    return render(request, "requests.html", context)

    
def approveRequests(request, pk):    
    req = Request.objects.get(RequestID=pk)    
    req.isConfirmed = True
    req.save()    
    return HttpResponse("Done")


class RequestView(APIView):
    def get(self, request):
        req = Request.objects.all()
        serializer = RequestSerializer(req, many=True)
        return Response(serializer.data)