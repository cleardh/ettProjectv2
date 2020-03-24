"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf.urls import url, include	
from django.urls import path
from backend.views import home, login
from roles.views import roles_create_view
from jobs.views import jobs_create_view
from userorganization.views import org_create_view
from register.views import profile_create_view
from request.views import requestView, requestListView, approvedRequests, approveRequests

urlpatterns = [    
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    url(r'^$', home),
    url(r'^login/', login),    
    url(r'^register/', profile_create_view),
    url(r'^roles/', roles_create_view),
    url(r'^jobs/', jobs_create_view, name='jobs_create_view'),
    url(r'^orgcreate/', org_create_view),
    url(r'^request/', requestView),
    url(r'^requests/', requestListView),
    url(r'^approved/', approvedRequests, name='approvedRequests'),
    url(r'^approve/(?P<pk>\d+)/$', approveRequests, name='approveRequests'),
]
