import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Layout,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const API_URL = 'http://localhost:3001/api/students';

const DEPARTMENT_OPTIONS = [
  { value: '智慧商務系', label: '智慧商務系' },
  { value: '資訊管理系', label: '資訊管理系' },
  { value: '電子商務系', label: '電子商務系' },
];

const COURSE_OPTIONS = [
  { value: 'React 入門',         label: 'React 入門'         },
  { value: 'Ant Design 元件應用', label: 'Ant Design 元件應用' },
  { value: '前端專案實作',         label: '前端專案實作'         },
  { value: '資料庫設計',           label: '資料庫設計'           },
  { value: '電子商務實務',         label: '電子商務實務'         },
];

/* ── 共用表單欄位（定義在 App 外，避免 re-render 重建元件） ── */
function StudentFormFields() {
  return (
    <>
      <Form.Item name="name" label="姓名" rules={[{ required: true, message: '請輸入姓名' }]}>
        <Input prefix={<UserOutlined />} placeholder="例如：王小明" />
      </Form.Item>
      <Form.Item name="student_id" label="學號" rules={[{ required: true, message: '請輸入學號' }]}>
        <Input placeholder="例如：S004" />
      </Form.Item>
      <Form.Item name="department" label="系所" rules={[{ required: true, message: '請選擇系所' }]}>
        <Select placeholder="請選擇系所" options={DEPARTMENT_OPTIONS} />
      </Form.Item>
      <Form.Item name="course" label="課程" rules={[{ required: true, message: '請選擇課程' }]}>
        <Select placeholder="請選擇課程" options={COURSE_OPTIONS} />
      </Form.Item>
      <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: '請輸入正確 Email' }]}>
        <Input placeholder="例如：student@example.com" />
      </Form.Item>
    </>
  );
}

function App() {
  const [form]     = Form.useForm();
  const [editForm] = Form.useForm();

  const [students,       setStudents]       = useState([]);
  const [filtered,       setFiltered]       = useState([]);
  const [keyword,        setKeyword]        = useState('');
  const [loading,        setLoading]        = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalOpen,    setIsModalOpen]    = useState(false);

  /* ── 查詢學生 ── */
  const fetchStudents = async (searchWord = '') => {
    try {
      setLoading(true);
      const params = searchWord ? `?keyword=${encodeURIComponent(searchWord)}` : '';
      const res    = await fetch(`${API_URL}${params}`);
      const data   = await res.json();
      if (!res.ok) throw new Error(data.message || '查詢失敗');
      setFiltered(data);
      // 無關鍵字時同步更新總筆數
      if (!searchWord) setStudents(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(''); }, []);

  /* ── 新增學生 ── */
  const handleAdd = async (values) => {
    try {
      const res  = await fetch(API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '新增失敗');
      message.success('新增成功');
      form.resetFields();
      setKeyword('');
      fetchStudents('');
    } catch (err) {
      message.error(err.message);
    }
  };

  /* ── 查詢按鈕 ── */
  const handleSearch = () => fetchStudents(keyword);

  /* ── 清除按鈕 ── */
  const handleClear = () => {
    setKeyword('');
    fetchStudents('');
  };

  /* ── 開啟修改 Modal ── */
  const openEditModal = (record) => {
    setEditingStudent(record);
    editForm.setFieldsValue(record);
    setIsModalOpen(true);
  };

  /* ── 儲存修改 ── */
  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const res    = await fetch(`${API_URL}/${editingStudent.id}`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '修改失敗');
      message.success('修改成功');
      setIsModalOpen(false);
      setEditingStudent(null);
      fetchStudents('');
    } catch (err) {
      if (err.errorFields) return;
      message.error(err.message);
    }
  };

  /* ── 刪除學生 ── */
  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '刪除失敗');
      message.success('刪除成功');
      fetchStudents('');
    } catch (err) {
      message.error(err.message);
    }
  };

  /* ── 表格欄位（姓名、學號、系所、課程、Email 順序對應圖片） ── */
  const columns = [
    { title: '姓名', dataIndex: 'name',       key: 'name',       width: 90  },
    {
      title: '學號',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 80,
      render: (val) => <Tag color="blue">{val}</Tag>,
    },
    { title: '系所',  dataIndex: 'department', key: 'department', width: 110 },
    {
      title: '課程',
      dataIndex: 'course',
      key: 'course',
      render: (val) => <Tag color="cyan">{val}</Tag>,
    },
    { title: 'Email', dataIndex: 'email',      key: 'email'                  },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            修改
          </Button>
          <Popconfirm
            title="確定刪除這筆資料？"
            okText="刪除"
            cancelText="取消"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>刪除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#001529', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          React Ant Design 學生資料 CRUD 系統
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>

          {/* ── 左側：新增表單 ── */}
          <Card
            title={<><PlusOutlined /> 新增學生資料</>}
            size="small"
          >
            <Form form={form} layout="vertical" onFinish={handleAdd} size="small">
              <StudentFormFields />
              <Space style={{ marginTop: 4 }}>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>新增</Button>
                <Button icon={<ReloadOutlined />} onClick={() => form.resetFields()}>清空</Button>
              </Space>
            </Form>
          </Card>

          {/* ── 右側：查詢 + 表格 ── */}
          <Card
            title={<><SearchOutlined /> 查詢與資料列表</>}
            size="small"
          >
            {/* 搜尋列 */}
            <Space style={{ marginBottom: 8 }} wrap>
              <Input
                style={{ width: 380 }}
                placeholder="請輸入姓名、學號、系所、課程或 Email 查詢"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onPressEnter={handleSearch}
                allowClear
              />
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
                查詢
              </Button>
              <Button onClick={handleClear}>清除</Button>
            </Space>

            {/* 統計文字 */}
            <div style={{ marginBottom: 12 }}>
              <Text type="secondary">
                目前共有 {students.length} 筆資料，查詢結果 {filtered.length} 筆。
              </Text>
            </div>

            <Table
              rowKey="id"
              size="small"
              loading={loading}
              dataSource={filtered}
              columns={columns}
              pagination={{ pageSize: 5, size: 'small' }}
              scroll={{ x: 800 }}
            />
          </Card>
        </div>

        {/* ── 修改 Modal ── */}
        <Modal
          title="修改學生資料"
          open={isModalOpen}
          onOk={handleUpdate}
          onCancel={() => { setIsModalOpen(false); setEditingStudent(null); }}
          okText="儲存修改"
          cancelText="取消"
          destroyOnHidden
        >
          <Form form={editForm} layout="vertical" size="small">
            <StudentFormFields />
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default App;
