import React, {useEffect, useState} from "react";
import {t} from "i18next";

import {DAYS} from "../consts";

interface Props {
    show: boolean;
    form: any;
    handleChange: any;
    renderErrorMessage: any;
    openLocationPicker: any;
    handleClose: any;
    onClose: () => void;
    onSubmit: any;
    editRoute?: any;
}

export const AddRouteModal: React.FC<Props> = ({
                                                   show,
                                                   form: _form,
                                                   onClose,
                                                   onSubmit,
                                                   editRoute,
                                                   handleClose,
                                                   renderErrorMessage,
                                                   openLocationPicker
                                               }) => {
    const [lo, setLo] = useState<boolean>(false);

    const [form, setForm] = useState<any>({
        name: '',
        days: [] as string[],
        time: '',
        seats: 1,
        contact: '',
        price: 0,
        driverName: ''
    });
    console.log(_form)

    useEffect(() => {
        if (_form.start) {
            let key = 'start';
            setForm((prevForm: any) => ({...prevForm, [key]: _form.start}));
        }
        if (_form.end) {
            let key = 'end';
            setForm((prevForm: any) => ({...prevForm, [key]: _form.end}));
        }
        if (_form.error) {
            setLo(false)
        }
    }, [_form]);

    useEffect(() => {
        if (editRoute) {
            setForm({
                name: editRoute.name,
                days: editRoute.days,
                time: editRoute.time,
                seats: editRoute.seats,
                contact: editRoute.contact,
                price: editRoute.price || 0,
                driverName: editRoute.driverName || ''
            });
        } else {
            setForm({
                name: '',
                days: [],
                time: '',
                seats: 1,
                contact: '',
                price: 0,
                driverName: ''
            });
        }
    }, [editRoute, show]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLo(true);
        // console.log('submit')
        if (
            !form.name || !form.time || !form.contact
            || form.days.length === 0
            || !form.start
            || !form.end
        ) {
            let keys = ['name', 'time', 'contact', 'days', 'start', 'end'];
            let missing = keys.filter(key => !form[key]);
            console.log(missing)
            if (form.days.length === 0) {
                missing.push('days');
            }
            alert(`Please fill in all required fields ${missing.join(', ')}`);
            return;
        }
        onSubmit({
            ...form,
            id: editRoute?.id || `${Date.now()}-${Math.random()}`,
            start: {lat: 52.520008, lng: 13.404954},
            end: {lat: 52.516275, lng: 13.377704},
            pointA: {coordinates: [form.start.lat, form.start.lng]},
            pointB: {coordinates: [form.end.lat, form.end.lng]},
            active: true,
            // driverId: mockCurrentUser.id
        });
        // onClose();
    };

    const toggleDay = (day: string) => {
        // @ts-ignore
        setForm(prev => ({
            ...prev,
            days: prev.days.includes(day)
                // @ts-ignore
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }));
    };

    if (!show) {
        console.log('re_');
        console.log('re');
        return null;
    }

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6_ flex-1 overflow-y-auto_">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Route Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.name}
                                    // @ts-ignore
                                    onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="e.g., Downtown Express"
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    className="block mb-1 font-medium">
                                    {t('start_location_label')}
                                    <span className="text-red-400">*</span>
                                </label>
                                <button
                                    type="button"
                                    className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-150 ring-offset-2 focus:ring-2 focus:ring-blue-500 ${!form.start ? 'border-red-500' : 'border-gray-300'}`}
                                    onClick={() => openLocationPicker('start')}
                                >
                                    {t('select_start_location_button')}
                                </button>
                                <input
                                    className={'flex max-h-[1px] max-w-[1px] ml-[90px]'}
                                    type="text"
                                    // style={{display: 'none'}}
                                    tabIndex={-1} required
                                    value={form.start?.lat ? '1' : ''}
                                    // placeholder={'s'}
                                    // readOnly
                                />
                                {renderErrorMessage('start')}
                                {form.start ? (
                                    <div className="text-green-700 text-sm">
                                        Selected: [{form.start.lat.toFixed(5)}, {form.start.lng.toFixed(5)}]
                                    </div>
                                ) : (
                                    <div
                                        className="text-gray-600 text-sm">{t('select_start_location_button')}.</div>
                                )}
                            </div>

                            <div>
                                <label className="block mb-1 font-medium">
                                    {t('end_location_label')}
                                    <span className="text-red-400">*</span>
                                </label>
                                <button
                                    type="button"
                                    className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-150 ring-offset-2 focus:ring-2 focus:ring-blue-500 ${!form.end ? 'border-red-500' : 'border-gray-300'}`}
                                    onClick={() => openLocationPicker('end')}
                                >
                                    {t('select_end_location_button')}
                                </button>
                                <input
                                    className={'flex max-h-[1px] max-w-[1px] ml-[90px]'}
                                    type="text"
                                    // style={{display: 'none'}}
                                    tabIndex={-1} required
                                    value={form.end?.lat ? '1' : ''}
                                    // placeholder={'s'}
                                    // readOnly
                                />
                                {renderErrorMessage('end')}
                                {form.end ? (
                                    <div className="text-green-700 text-sm">
                                        Selected: [{form.end?.lat.toFixed(5)}, {form.end?.lng?.toFixed(5)}]
                                    </div>
                                ) : (
                                    <div
                                        className="text-gray-600 text-sm">{t('select_end_location_button')}.</div>
                                )}
                            </div>
                            {/*<div>*/}
                            {/*    <label className="block text-sm font-medium text-gray-300 mb-2">*/}
                            {/*        Driver Name <span className="text-red-400">*</span>*/}
                            {/*    </label>*/}
                            {/*    <input*/}
                            {/*        type="text"*/}
                            {/*        value={form.driverName}*/}
                            {/*        onChange={(e) => setForm(prev => ({...prev, driverName: e.target.value}))}*/}
                            {/*        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"*/}
                            {/*        placeholder="Your name"*/}
                            {/*        required*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Active Days <span className="text-red-400">*</span>
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {DAYS.map(({short}) => (
                                        <button
                                            key={short}
                                            type="button"
                                            onClick={() => toggleDay(short)}
                                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                                                form.days.includes(short)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                            }`}
                                        >
                                            {short}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    className={'flex max-h-[1px] max-w-[1px] ml-[90px]'}
                                    type="text"
                                    // style={{display: 'none'}}
                                    tabIndex={-1} required
                                    value={form.days?.length ? '1' : ''}
                                    // placeholder={'s'}
                                    // readOnly
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Departure Time <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={form.time}
                                        // @ts-ignore
                                        onChange={(e) => setForm(prev => ({...prev, time: e.target.value}))}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Available
                                        Seats</label>
                                    <select
                                        value={form.seats}
                                        // @ts-ignore
                                        onChange={(e) => setForm(prev => ({...prev, seats: Number(e.target.value)}))}
                                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/*<div>*/}
                            {/*    <label className="block text-sm font-medium text-gray-300 mb-2">Price per Ride*/}
                            {/*        (€)</label>*/}
                            {/*    <input*/}
                            {/*        type="number"*/}
                            {/*        min="0"*/}
                            {/*        value={form.price}*/}
                            {/*        onChange={(e) => setForm(prev => ({...prev, price: Number(e.target.value)}))}*/}
                            {/*        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"*/}
                            {/*        placeholder="0"*/}
                            {/*    />*/}
                            {/*</div>*/}

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Contact <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={form.contact}
                                    // @ts-ignore
                                    onChange={(e) => setForm(prev => ({...prev, contact: e.target.value}))}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                                    placeholder="Phone or email"
                                    required
                                />
                            </div>
                            <div
                                className="bg-gray-800 hidden fixed inset-0 bg-opacity-30 flex items-center justify-center z-10"
                                onClick={handleClose}
                            >
                                <div
                                    className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow p-6 max-w-md w-full relative max-h-[90vh] overflow-y-auto"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <button
                                        className="absolute top-2 right-3 text-gray-400 hover:text-red-600 text-lg"
                                        onClick={handleClose}
                                        aria-label="Close"
                                    >×
                                    </button>
                                    <h2 className="text-xl font-semibold mb-4">{t('modal_title')}</h2>
                                </div>
                            </div>
                            {/*<div>*/}
                            {/*    <label className="block mb-1 font-medium">{t('days_active_label')}</label>*/}
                            {/*    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">*/}
                            {/*        {DAYS?.map(({short: day}) => (*/}
                            {/*            <label key={day}*/}
                            {/*                   className="inline-flex items-center space-x-2 cursor-pointer group">*/}
                            {/*                <input*/}
                            {/*                    type="checkbox"*/}
                            {/*                    checked={form?.days?.includes(day) || false}*/}
                            {/*                    onChange={() => handleDayToggle(day)}*/}
                            {/*                    className="hidden"*/}
                            {/*                />*/}
                            {/*                <span*/}
                            {/*                    className={`rounded-full w-6 h-6 inline-block transition duration-150 ease-in-out transform scale-100 ${form?.days?.includes(day) ? 'bg-blue-600' : 'bg-gray-300'}`}></span>*/}
                            {/*                <span className="ml-2 text-gray-700">{day}</span>*/}
                            {/*            </label>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div>*/}
                            {/*    <label*/}
                            {/*        className="block mb-1 font-medium">{t('departure_time_label')}</label>*/}
                            {/*    <input*/}
                            {/*        required*/}
                            {/*        type="time"*/}
                            {/*        name="time"*/}
                            {/*        value={form.time || ''}*/}
                            {/*        onChange={handleChange}*/}
                            {/*        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div>*/}
                            {/*    <label className="block mb-1 font-medium">{t('number_seats_label')}</label>*/}
                            {/*    <div className="flex gap-2">*/}
                            {/*        {[1, 2, 3, 4, 5, 6, '>6']?.map(seatOption => (*/}
                            {/*            <button*/}
                            {/*                key={seatOption}*/}
                            {/*                type="button"*/}
                            {/*                onClick={() => setForm((prevForm: any) => ({*/}
                            {/*                    ...prevForm,*/}
                            {/*                    seats: seatOption*/}
                            {/*                }))}*/}
                            {/*                className={`${form.seats === seatOption ? 'bg-blue-600 text-white' : 'text-gray-700'} py-2 px-4 rounded-md focus:outline-none transition-colors duration-150 ring-offset-2 focus:ring-2 focus:ring-blue-500`}*/}
                            {/*            >*/}
                            {/*                {seatOption}*/}
                            {/*            </button>*/}
                            {/*        ))}*/}
                            {/*    </div>*/}
                            {/*</div>*/}

                            {/*<div>*/}
                            {/*    <label*/}
                            {/*        className="block mb-1 font-medium">{t('contact_method_label')}</label>*/}
                            {/*    <input*/}
                            {/*        required*/}
                            {/*        type="text"*/}
                            {/*        name="contact"*/}
                            {/*        value={form.contact || ''}*/}
                            {/*        onChange={handleChange}*/}
                            {/*        className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"*/}
                            {/*        placeholder="Email, phone, or other"*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 z-10 flex gap-1">*/}
                            {/*    <button*/}
                            {/*        type="submit"*/}
                            {/*        className="w-full bg-blue-600 relative z-20 text-white py-2 rounded hover:bg-blue-700 shadow-lg"*/}
                            {/*        disabled={!form.start || !form.end}*/}
                            {/*    >*/}
                            {/*        {t('add_route_button_submit')}*/}
                            {/*    </button>*/}
                            {/*    <button*/}
                            {/*        type="button"*/}
                            {/*        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 shadow-lg"*/}
                            {/*        onClick={handleClose}*/}
                            {/*    >*/}
                            {/*        {t('cancel')}*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                            <div
                                className="btns flex gap-3 pt-4 sticky bottom-0 left-0 right-0 bg-gray-800 z-20 pb-4 border-t border-gray-700 shadow-lg">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={lo}
                                    type="submit"
                                    className={
                                        "flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all font-medium"
                                        + (lo ? ' opacity-50 cursor-not-allowed disabled' : '')}
                                >
                                    {editRoute ? 'Update Route' : 'Add Route'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
