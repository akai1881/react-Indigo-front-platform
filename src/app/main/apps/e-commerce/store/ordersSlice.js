import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import axios from 'axios';
import firebaseService from 'app/services/firebaseService/firebaseService';
import { useRowSelect } from 'react-table';
import { getTodayData } from './helpers/functions';
import moment from 'moment';

export const getOrders = createAsyncThunk('eCommerceApp/orders/getOrders', async () => {
	const response = await axios.get('/api/e-commerce-app/orders');
	const data = await response.data;

	return data;
});

export const getUsersData = createAsyncThunk('eCommerceApp/orders/getUsersData', async params => {
	const usersRef = await firebaseService.database.collection('shifts').doc(params).collection('users').get();

	// const data = users.map(doc => ({ ...doc.data() }));

	// console.log('this is dat', data);

	const usersData = await usersRef.docs.map(doc => ({
		...doc.data(),
		date: doc.data().date && moment(doc.data().date?.toDate()).format('h:mm a'),
		time: doc.data().date?.toDate() ?? '',
		dueTime: doc.data().dueTime && moment(doc.data().dueTime.toDate()).format('h:mm a'),
		id: doc.data().uid
	}));

	console.log('THIS IS USERS DATA', usersData);

	return usersData;
});

export const changeUserStatus = createAsyncThunk('eCommerceApp/orders/changeUserStatus', async (data, { dispatch }) => {
	const { dayId, userId, userData } = data;
	return firebaseService.database.doc(`/shifts/${dayId}/users/${userId}`).update({
		userData
	})
		.then(() => dispatch(getUsersData(dayId)));
});

export const getTime = createAsyncThunk('eCommerceApp/orders/getTime', async params => {
	let time;
	await firebaseService.database
		.collection('shifts')
		.doc(params)
		.get()
		.then(doc => (time = doc.data().time));

	return time.toDate().toJSON().slice(0, 10).split('-').reverse().join('-');
});

export const changeStatus = createAsyncThunk('eCommerceApp/orders/changeStatus', async (data, { dispatch }) => {
	const { id, status, dayId } = data;

	await firebaseService
		.database()
		.doc(`shifts/${dayId}/users/${id}`)
		.update({
			isLate: status
		})
		.then(doc => dispatch(getUsersData()));
});

const ordersAdapter = createEntityAdapter({});

export const { selectAll: selectOrders, selectById: selectOrderById } = ordersAdapter.getSelectors(
	state => state.eCommerceApp.orders
);

const ordersSlice = createSlice({
	name: 'eCommerceApp/orders',
	initialState: {
		users: [],
		time: '',
		timeDialog: null
	},
	reducers: {
		setOrdersSearchText: {
			reducer: (state, action) => {
				state.searchText = action.payload;
			},
			prepare: event => ({ payload: event.target.value || '' })
		},
		openEditTimeDialog: (state, action) => {
			state.timeDialog = {
				type: 'edit',
				props: {
					open: true
				},
				data: action.payload
			};
		},
		closeEditTimeDialog: (state, action) => {
			state.timeDialog = {
				type: 'edit',
				props: {
					open: false
				},
				data: null
			};
		}
	},
	extraReducers: {
		// [getOrders.fulfilled]: ordersAdapter.setAll,
		[getUsersData.fulfilled]: (state, action) => {
			state.users = action.payload;
		},
		[getTime.fulfilled]: (state, action) => {
			state.time = action.payload;
		}
	}
});

export const { setOrdersSearchText, closeEditTimeDialog, openEditTimeDialog } = ordersSlice.actions;

export default ordersSlice.reducer;
