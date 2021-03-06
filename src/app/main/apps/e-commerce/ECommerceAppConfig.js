import { authRoles } from 'app/auth';
import React from 'react';
import { Redirect } from 'react-router-dom';

const ECommerceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: '/apps/employee/set/:userId/:userHandle?',
			component: React.lazy(() => import('./product/Product'))
		},
		{
			path: '/apps/employee/set/new',
			auth: authRoles.admin,
			component: React.lazy(() => import('./product/Product'))
		},
		{
			path: '/apps/employee/set/:userId',
			component: React.lazy(() => import('./product/Product'))
		},
		{
			path: '/apps/e-commerce/products',
			component: React.lazy(() => import('./products/Products'))
		},
		{
			path: '/apps/employee/shifts/:dayId',
			component: React.lazy(() => import('./orders/Orders'))
		},
		{
			path: '/apps/employee/shifts',
			component: React.lazy(() => import('./orders/Orders'))
		},
		{
			path: '/apps/e-commerce',
			component: () => <Redirect to="/apps/e-commerce/products" />
		}
	]
};

export default ECommerceAppConfig;
