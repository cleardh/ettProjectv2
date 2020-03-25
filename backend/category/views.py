from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CategorySerializer
from .models import Category

class CategoryView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)