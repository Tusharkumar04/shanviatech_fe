import { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/routes/guards';
import { AppLayout } from '@/components/layout/app-layout';
import { LoginPage } from '@/pages/auth/login-page';
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { SettingsPage } from '@/pages/settings/settings-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ResourceListPage } from '@/pages/resource/resource-list-page';
import { ResourceFormPage } from '@/pages/resource/resource-form-page';
import { ResourceDetailsPage } from '@/pages/resource/resource-details-page';
import { SinglePageEditor } from '@/pages/single/single-page-editor';
import { collectionModules, singleModules } from '@/config/modules';
import { surveyQueryModule } from '@/config/modules/survey-query';
import { SurveyQueryFormPage } from '@/pages/survey-query/survey-query-form-page';
import { SurveyResponseListPage } from '@/pages/survey-response/survey-response-list-page';
import { SurveyResponseChatPage } from '@/pages/survey-response/survey-response-chat-page';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="settings" element={<SettingsPage />} />

          {/* Single-document (create-or-update) pages */}
          {singleModules.map((module) => (
            <Route
              key={module.key}
              path={module.routePath}
              element={<SinglePageEditor config={module} />}
            />
          ))}

          {/* Survey Queries — generic list, custom form (runtime parent options) */}
          <Route
            path={surveyQueryModule.routePath}
            element={<ResourceListPage config={surveyQueryModule} />}
          />
          <Route path={`${surveyQueryModule.routePath}/new`} element={<SurveyQueryFormPage />} />
          <Route path={`${surveyQueryModule.routePath}/:id`} element={<SurveyQueryFormPage />} />
          <Route path={`${surveyQueryModule.routePath}/:id/edit`} element={<SurveyQueryFormPage />} />

          {/* Survey Responses — custom realtime chat pages */}
          <Route path="survey-response" element={<SurveyResponseListPage />} />
          <Route path="survey-response/:id" element={<SurveyResponseChatPage />} />

          {/* Collection (CRUD) modules */}
          {collectionModules.map((module) => (
            <Fragment key={module.key}>
              <Route
                path={module.routePath}
                element={<ResourceListPage config={module} />}
              />
              <Route
                path={`${module.routePath}/new`}
                element={<ResourceFormPage config={module} />}
              />
              <Route
                path={`${module.routePath}/:id/edit`}
                element={<ResourceFormPage config={module} />}
              />
              <Route
                path={`${module.routePath}/:id`}
                element={<ResourceDetailsPage config={module} />}
              />
            </Fragment>
          ))}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
