"use client";

import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useForm, Controller } from 'react-hook-form';

// Ant Design Imports
import {
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Row,
  Col,
  ConfigProvider,
  theme as antTheme,
  Typography,
} from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'; // Hapus FileTextOutlined dan EditOutlined jika tidak digunakan
import dayjs from 'dayjs';
import 'dayjs/locale/id'; // Import locale id untuk dayjs

const { Option } = Select;
const { TextArea } = Input;
const { useToken } = antTheme;

// Menggunakan forwardRef agar komponen ini bisa menerima ref dari parent
const AppointmentForm = forwardRef(({ initialData, theme, onFormChange, onSubmit }, ref) => {
  const {
    // register, // Dihapus karena semua input dikelola oleh Controller
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      doctor: '',
      specialty: '',
      date: null, // dayjs object
      time: null, // dayjs object
      reason: '',
      location: '',
      notes: '',
      status: 'Menunggu Persetujuan'
    }
  });

  const { token } = useToken();

  // Efek untuk mengisi form ketika initialData berubah (saat edit)
  useEffect(() => {
    if (initialData) {
      setValue('doctor', initialData.doctor || '');
      setValue('specialty', initialData.specialty || '');

      if (initialData.date) {
        const dateObj = dayjs(initialData.date);
        setValue('date', dateObj.isValid() ? dateObj : null);
      } else {
        setValue('date', null);
      }

      if (initialData.time) {
        const timeObj = dayjs(`${dayjs().format('YYYY-MM-DD')}T${initialData.time}`);
        setValue('time', timeObj.isValid() ? timeObj : null);
      } else {
        setValue('time', null);
      }

      setValue('reason', initialData.reason || '');
      setValue('location', initialData.location || '');
      setValue('notes', initialData.notes || '');
      setValue('status', initialData.status || 'Menunggu Persetujuan');
    } else {
      reset(); // Reset form saat tidak ada initialData (mode tambah baru)
    }
  }, [initialData, setValue, reset]);

  // Mengamati perubahan form untuk prop onFormChange (jika ada)
  const watchedFields = watch();
  useEffect(() => {
    if (onFormChange) {
      let datePart = null;
      let timePart = null;

      if (watchedFields.date && dayjs.isDayjs(watchedFields.date) && watchedFields.date.isValid()) {
        datePart = watchedFields.date.format('YYYY-MM-DD');
      }
      if (watchedFields.time && dayjs.isDayjs(watchedFields.time) && watchedFields.time.isValid()) {
        timePart = watchedFields.time.format('HH:mm');
      }

      onFormChange({
        ...watchedFields,
        date: datePart,
        time: timePart
      });
    }
  }, [watchedFields, onFormChange]);

  // useImperativeHandle untuk memanggil submitForm dari parent
  useImperativeHandle(ref, () => ({
    submitForm: () => {
      handleSubmit((data) => {
        // Ini adalah callback yang hanya akan dieksekusi JIKA validasi berhasil
        const finalData = {
          ...data,
          date: data.date && dayjs.isDayjs(data.date) && data.date.isValid() ? data.date.format('YYYY-MM-DD') : '',
          time: data.time && dayjs.isDayjs(data.time) && data.time.isValid() ? data.time.format('HH:mm') : '',
        };
        console.log("Form data valid, calling onSubmit:", finalData); // Log ini
        onSubmit(finalData);
      }, (errors) => {
        // Ini adalah callback yang akan dieksekusi JIKA validasi GAGAL
        console.log("Validasi form gagal, errors:", errors); // Log ini
      })(); // Ini akan langsung memicu validasi dan eksekusi callback yang sesuai
    }
  }));

  const doctors = [
    { name: 'Dr. Sarah', specialty: 'Kardiologi' },
    { name: 'Dr. Michael', specialty: 'Dermatologi' },
    { name: 'Dr. Emily Davis', specialty: 'General Practitioner' },
    { name: 'Dr. Robert Wilson', specialty: 'Orthopedics' },
    { name: 'Dr. Anne Hathaway', specialty: 'Psychology' },
    { name: 'Dr. David Lee', specialty: 'Dentistry' },
    { name: 'Dr. Budi Santoso', specialty: 'Penyakit Dalam' },
  ];

  const availableSpecialties = Array.from(new Set(doctors.map(d => d.specialty)));

  // Custom styling untuk input agar konsisten dengan tema
  const inputBaseStyle = {
    borderRadius: '8px',
    backgroundColor: theme === 'dark' ? token.colorFillAlter : token.colorBgContainer,
    color: theme === 'dark' ? token.colorTextBase : token.colorText,
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: theme === 'dark' ? '#90caf9' : '#1890ff',
          colorInfo: theme === 'dark' ? '#90caf9' : '#1890ff',
          colorSuccess: theme === 'dark' ? '#a7e8bd' : '#52c41a',
          colorWarning: theme === 'dark' ? '#ffe082' : '#faad14',
          colorError: theme === 'dark' ? '#ff8a80' : '#f5222d',
          colorTextBase: theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
          colorBgContainer: theme === 'dark' ? '#262626' : '#ffffff',
          colorFillAlter: theme === 'dark' ? '#3b3b3b' : '#f5f5f5',
          colorBorder: theme === 'dark' ? '#434343' : '#d9d9d9',
          colorBorderSecondary: theme === 'dark' ? '#595959' : '#f0f0f0',
          controlItemBgActive: theme === 'dark' ? 'rgba(144, 202, 249, 0.15)' : '#e6f7ff',
          controlItemBgHover: theme === 'dark' ? 'rgba(144, 202, 249, 0.08)' : '#f5f5f5',
          colorPrimaryBg: theme === 'dark' ? 'rgba(144, 202, 249, 0.1)' : '#e6f7ff',
          colorPrimaryHover: theme === 'dark' ? '#64b5f6' : '#40a9ff',
          colorBgElevated: theme === 'dark' ? '#2c3e50' : '#ffffff',
        },
        components: {
          Input: {
            activeBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            hoverBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            colorBgContainer: theme === 'dark' ? '#3b3b3b' : '#ffffff',
            colorText: theme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.85)',
            colorTextPlaceholder: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
          },
          Select: {
            activeBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            hoverBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            colorBgContainer: theme === 'dark' ? '#3b3b3b' : '#ffffff',
            colorText: theme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.85)',
            colorTextPlaceholder: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
            optionSelectedBg: theme === 'dark' ? 'rgba(144, 202, 249, 0.15)' : '#e6f7ff',
            optionActiveBg: theme === 'dark' ? 'rgba(144, 202, 249, 0.08)' : '#f5f5f5',
            optionSelectedColor: theme === 'dark' ? token.colorPrimary : token.colorPrimary,
            optionActiveColor: theme === 'dark' ? token.colorPrimary : token.colorPrimary,
          },
          DatePicker: {
            activeBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            hoverBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            colorBgContainer: theme === 'dark' ? '#3b3b3b' : '#ffffff',
            colorText: theme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.85)',
            colorTextPlaceholder: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
            cellActiveWithRangeBg: theme === 'dark' ? token.colorPrimaryBg : token.colorPrimaryBg,
            cellHoverBg: theme === 'dark' ? token.controlItemBgHover : token.controlItemBgHover,
            cellSelectedBg: theme === 'dark' ? token.colorPrimary : token.colorPrimary,
            cellRangeHoverBg: theme === 'dark' ? token.colorPrimaryBg : token.colorPrimaryBg,
          },
          TimePicker: {
            activeBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            hoverBorderColor: theme === 'dark' ? '#90caf9' : '#1890ff',
            colorBgContainer: theme === 'dark' ? '#3b3b3b' : '#ffffff',
            colorText: theme === 'dark' ? 'white' : 'rgba(0, 0, 0, 0.85)',
            colorTextPlaceholder: theme === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
            itemActiveBg: theme === 'dark' ? token.colorPrimaryBg : token.colorPrimaryBg,
            itemHoverBg: theme === 'dark' ? token.controlItemBgHover : token.controlItemBgHover,
          },
        },
      }}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)} // handleSubmit akan mencegah onFinish jika validasi gagal
        initialValues={initialData}
        style={{
          color: theme === 'dark' ? token.colorTextBase : token.colorText,
        }}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Nama Dokter</Typography>}
              name="doctor"
              // Hapus rules dari Form.Item, karena validasi ditangani oleh Controller
              validateStatus={errors.doctor ? 'error' : ''}
              help={errors.doctor?.message}
            >
              <Controller
                name="doctor"
                control={control}
                rules={{ required: true, message: 'Nama dokter wajib diisi!' }} // Rules ada di Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Pilih Dokter"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                    }
                    style={inputBaseStyle}
                    suffixIcon={<UserOutlined style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }} />}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value="" disabled>
                      <Typography.Text disabled style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#9e9e9e' }}>Pilih Dokter</Typography.Text>
                    </Option>
                    {doctors.map((doc) => (
                      <Option key={doc.name} value={doc.name}>
                        {doc.name} ({doc.specialty})
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Spesialisasi</Typography>}
              name="specialty"
              // Hapus rules dari Form.Item
              validateStatus={errors.specialty ? 'error' : ''}
              help={errors.specialty?.message}
            >
              <Controller
                name="specialty"
                control={control}
                rules={{ required: true, message: 'Spesialisasi wajib diisi!' }} // Rules ada di Controller
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Pilih Spesialisasi"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children?.toLowerCase() ?? '').includes(input.toLowerCase())
                    }
                    style={inputBaseStyle}
                    suffixIcon={<MedicineBoxOutlined style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }} />}
                    getPopupContainer={trigger => trigger.parentNode}
                  >
                    <Option value="" disabled>
                      <Typography.Text disabled style={{ color: theme === 'dark' ? 'rgba(255,255,255,0.5)' : '#9e9e9e' }}>Pilih Spesialisasi</Typography.Text>
                    </Option>
                    {availableSpecialties.map((spec) => (
                      <Option key={spec} value={spec}>
                        {spec}
                      </Option>
                    ))}
                  </Select>
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Tanggal Janji Temu</Typography>}
              name="date"
              // Hapus rules dari Form.Item
              validateStatus={errors.date ? 'error' : ''}
              help={errors.date?.message}
            >
              <Controller
                name="date"
                control={control}
                rules={{ required: true, message: 'Tanggal wajib diisi!' }} // Rules ada di Controller
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    value={field.value}
                    onChange={(date) => field.onChange(date)}
                    format="DD MMMM YYYY"
                    locale={dayjs.locale('id')}
                    style={inputBaseStyle}
                    suffixIcon={<CalendarOutlined style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }} />}
                    disabledDate={(current) => current && current < dayjs().startOf('day')}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Waktu Janji Temu</Typography>}
              name="time"
              // Hapus rules dari Form.Item
              validateStatus={errors.time ? 'error' : ''}
              help={errors.time?.message}
            >
              <Controller
                name="time"
                control={control}
                rules={{ required: true, message: 'Waktu wajib diisi!' }} // Rules ada di Controller
                render={({ field }) => (
                  <TimePicker
                    {...field}
                    value={field.value}
                    onChange={(time) => field.onChange(time)}
                    format="HH:mm"
                    locale={dayjs.locale('id')}
                    style={inputBaseStyle}
                    suffixIcon={<ClockCircleOutlined style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }} />}
                    getPopupContainer={trigger => trigger.parentNode}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Alasan Janji Temu</Typography>}
              name="reason"
              // Hapus rules dari Form.Item
              validateStatus={errors.reason ? 'error' : ''}
              help={errors.reason?.message}
            >
              <Controller
                name="reason"
                control={control}
                rules={{ required: true, message: 'Alasan wajib diisi!' }} // Rules ada di Controller
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={1}
                    placeholder="Tulis alasan Anda ingin bertemu dengan dokter"
                    style={inputBaseStyle}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Lokasi (Ruangan)</Typography>}
              name="location"
              // Hapus rules dari Form.Item
              validateStatus={errors.location ? 'error' : ''}
              help={errors.location?.message}
            >
              <Controller
                name="location"
                control={control}
                rules={{ required: true, message: 'Lokasi wajib diisi!' }} // Rules ada di Controller
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Contoh: Ruang 1, Gedung A"
                    style={inputBaseStyle}
                    prefix={<EnvironmentOutlined style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }} />}
                  />
                )}
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label={<Typography style={{ color: theme === 'dark' ? token.colorTextSecondary : token.colorText }}>Catatan Tambahan</Typography>}
              name="notes"
            >
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    rows={2}
                    placeholder="Tambahkan informasi tambahan jika perlu"
                    style={inputBaseStyle}
                  />
                )}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </ConfigProvider>
  );
});

export default AppointmentForm;
