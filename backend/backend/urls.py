from django.contrib import admin
from django.conf.urls import url, include	
from django.urls import path
from backend.views import home, login

from category.views import getCategories, addCategories, getCategoryByID, deleteCategory, getCategoryByName
from jobs.views import getJobs, addJobs, getJobByID, deleteJob, getJobByTitle
from organization.views import getOrgs, addOrgs, getOrgsByID, deleteOrg, getOrgByTitle, getOrgByHead
from register.views import ProfileView, ProfileDetailView
from request.views import addRequest, getRequestByID, approveRequestByID, deleteRequest
from roles.views import getRoles, addRoles, getRoleByID, deleteRole, getRoleByTitle
from userorganization.views import UsrOrgView


urlpatterns = [    
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    url(r'^$', home),

    url(r'^category/$', getCategories),
    url(r'^category-add/$', addCategories),
    url(r'^category/(?P<pk>\d+)/$', getCategoryByID),
    url(r'^category-delete/(?P<pk>\d+)/$', deleteCategory),
    url(r'^category-name/(?P<name>.+)/$', getCategoryByName),
    
    url(r'^job/$', getJobs),
    url(r'^job-add/$', addJobs),
    url(r'^job/(?P<pk>\d+)/$', getJobByID),
    url(r'^job-delete/(?P<pk>\d+)/$', deleteJob),
    url(r'^job-title/(?P<title>.+)/$', getJobByTitle),

    url(r'^role/$', getRoles),
    url(r'^role-add/$', addRoles),
    url(r'^role/(?P<pk>\d+)/$', getRoleByID),
    url(r'^role-delete/(?P<pk>\d+)/$', deleteRole),
    url(r'^role-title/(?P<title>.+)/$', getRoleByTitle),

    url(r'^organization/$', getOrgs),
    url(r'^organization-add/$', addOrgs),
    url(r'^organization/(?P<pk>\d+)/$', getOrgsByID),
    url(r'^organization-delete/(?P<pk>\d+)/$', deleteOrg),
    url(r'^organization-title/(?P<title>.+)/$', getOrgByTitle),
    url(r'^organizationhead/(?P<head>\d+)/$', getOrgByHead),
    
    url(r'^request-add/$', addRequest),
    url(r'^request/(?P<pk>\d+)/$', getRequestByID),
    url(r'^request-approve/(?P<pk>\d+)/$', approveRequestByID),
    url(r'^request-delete/(?P<pk>\d+)/$', deleteRequest),

]