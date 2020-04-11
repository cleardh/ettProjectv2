from django.contrib import admin
from django.conf.urls import url, include	
from django.urls import path

from category.views import getAllCategories, createCategory, getCategoryByID, deleteCategoryByID, getCategoryByTitle, updateCategoryByID
from jobs.views import getAllJobs, createJob, getJobByID, deleteJobByID, getJobByTitle
from organization.views import getAllOrganizations, createOrganization, getOrganizationByID, deleteOrganizationByID, getOrganizationByTitle, getOrganizationByHead, getOrganizationByLevel
from profile.views import getAllUsers, getUserByEmail, createUser, updateUserByID, getUserByID, deleteUser, getCurrentUser
from request.views import getRequests, downloadRequests, getRequestsByEmail, getConfirmedRequestsByEmail, getConfirmedRequestsByEmailCat, createRequest, confirmRequestByID, deleteRequestByID, getRequestByID
from roles.views import getAllRoles, createRole, getRoleByID, deleteRoleByID, getRoleByTitle
from userorganization.views import getOrgs, addUOrgs, deleteUOrg
from level.views import getAllLevels, createLevel, deleteLevelByID, getLevelByTitle
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [    
    path('admin/', admin.site.urls),

    url(r'^get-token/$', TokenObtainPairView.as_view()),
    url(r'^token-refresh/$', TokenRefreshView.as_view()),

    url(r'^category/$', getAllCategories),
    url(r'^category-add/$', createCategory),
    url(r'^category/(?P<pk>\d+)/$', getCategoryByID),
    url(r'^category-delete/(?P<pk>\d+)/$', deleteCategoryByID),
    url(r'^category-title/(?P<title>.+)/$', getCategoryByTitle),
    url(r'^category-update/(?P<pk>\d+)/$', updateCategoryByID),

    url(r'^job/$', getAllJobs),
    url(r'^job-add/$', createJob),
    url(r'^job/(?P<pk>\d+)/$', getJobByID),
    url(r'^job-delete/(?P<pk>\d+)/$', deleteJobByID),
    url(r'^job-title/(?P<title>.+)/$', getJobByTitle),

    url(r'^role/$', getAllRoles),
    url(r'^role-add/$', createRole),
    url(r'^role/(?P<pk>\d+)/$', getRoleByID),
    url(r'^role-delete/(?P<pk>\d+)/$', deleteRoleByID),
    url(r'^role-title/(?P<title>.+)/$', getRoleByTitle),

    url(r'^organization/$', getAllOrganizations),
    url(r'^organization-add/$', createOrganization),
    url(r'^organization/(?P<pk>\d+)/$', getOrganizationByID),
    url(r'^organization-delete/(?P<pk>\d+)/$', deleteOrganizationByID),
    url(r'^organization-title/(?P<title>.+)/$', getOrganizationByTitle),
    url(r'^organization-head/(?P<head>\d+)/$', getOrganizationByHead),
    url(r'^organization-level/(?P<level>\d+)/$', getOrganizationByLevel),
    
    url(r'^request-add/$', createRequest),
    url(r'^request/(?P<pk>\d+)/$', getRequestByID),
    url(r'^requests/$', getRequests),
    url(r'^requests-email/(?P<email>.+)/$', getRequestsByEmail),
    url(r'^requests-cemail/(?P<email>.+)/$', getConfirmedRequestsByEmail),
    url(r'^requests-ccemail/(?P<email>.+)/(?P<title>.+)/$', getConfirmedRequestsByEmailCat),
    url(r'^request-approve/(?P<pk>\d+)/$', confirmRequestByID),
    url(r'^request-delete/(?P<pk>\d+)/$', deleteRequestByID),
    url(r'^requests-download/$', downloadRequests),

    url(r'^user-add/$', createUser),
    url(r'^users/$', getAllUsers),
    url(r'^user/(?P<pk>\d+)/$', getUserByID),
    url(r'^user-email/(?P<email>.+)/$', getUserByEmail),
    url(r'^user-update/(?P<pk>\d+)/$', updateUserByID),
    url(r'^user-delete/(?P<pk>\d+)/$', deleteUser),
    url(r'^user-current/$', getCurrentUser),

    url(r'^levels/$', getAllLevels),
    url(r'^level-add/$', createLevel),
    url(r'^level-delete/(?P<pk>\d+)/$', deleteLevelByID),
    url(r'^level-title/(?P<title>.+)/$', getLevelByTitle),

    url(r'^usrorg/$', getOrgs),
    url(r'^usrorg-add/$', addUOrgs),
    url(r'^usrorg-delete/(?P<pk>\d+)/$', deleteUOrg),
]

#from django.contrib.auth.models import User
#user=User.objects.create_user('Michael', password='bar', first_name='Michael', last_name='Kane', email='mk@gmail.com')
#user=User.objects.create_user('Jason', password='bar', first_name='Jason', last_name='Bourne', email='jb@gmail.com')