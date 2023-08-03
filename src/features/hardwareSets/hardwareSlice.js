import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { HardwareModel } from './HardwareModel'

const initialState = {
    loading: false,
    hardwareSet1: {},
    hardwareSet2: {},
    error: ''
}

//it will automatically return the lifecycle actions depending on the promise
//promise is either pending, fullfiled or rejected
//reducers are not generated by the slice
//all part of extra-reducers
export const fetchHardwareSets = createAsyncThunk('hardware/fetchHardwareSets', async () => {
    const response = await axios
        .get('http://127.0.0.1:5000/api/get-hardware')
    return response.data
    //we don't need the catch block as error is handled
})

const hardwareSlice = createSlice({
    name: 'hardware',
    initialState,
    extraReducers: (builder) => {
        builder.addCase(fetchHardwareSets.pending, (state) => {
            state.loading = true
        })
        builder.addCase(fetchHardwareSets.fulfilled, (state, action) => {
            state.loading = false
            const res = action.payload.data
            const hwSet1 = new HardwareModel(
                res.hardwareSets[0].capacity,
                res.hardwareSets[0].availability
            )
            state.hardwareSet1 = hwSet1
            const hwSet2 = new HardwareModel(
                res.hardwareSets[1].capacity,
                res.hardwareSets[1].availability
            )
            state.hardwareSet2 = hwSet2
            state.error = ''
        })
        builder.addCase(fetchHardwareSets.rejected, (state, action) => {
            state.loading = false
            state.hardwareSet1 = {}
            state.hardwareSet2 = {}
            state.error = action.error.message
        })
    }
})

export default hardwareSlice.reducer