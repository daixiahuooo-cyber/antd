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
const { Title, Paragraph, Text } = Typography;
const API_URL = '/api/students';

function App() {
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [students, setStudents] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStudents = async (searchWord = keyword) => {
    try {
      setLoading(true);
      const params = searchWord ? `?keyword=${encodeURIComponent(searchWord)}` : '';
      const res = await fetch(`${API_URL}${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '查詢失敗');
      setStudents(data);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents('');
  }, []);

  const handleAdd = async (values) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '新增失敗');
      message.success('新增成功');
      form.resetFields();
      fetchStudents('');
      setKeyword('');
    } catch (err) {
      message.error(err.message);
    }
  };

  const openEditModal = (record) => {
    setEditingStudent(record);
    editForm.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await editForm.validateFields();
      const res = await fetch(`${API_URL}/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '修改失敗');
      message.success('修改成功');
      setIsModalOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      if (err.errorFields) return;
      message.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '刪除失敗');
      message.success('刪除成功');
      fetchStudents();
    } catch (err) {
      message.error(err.message);
    }
  };

  const columns = [
    {
      title: '學號',
      dataIndex: 'student_id',
      key: 'student_id',
      width: 110,
      render: (value) => <Tag color="blue">{value}</Tag>,
    },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 110 },
    { title: '系所', dataIndex: 'department', key: 'department' },
    { title: '課程', dataIndex: 'course', key: 'course' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: '操作',
      key: 'action',
      width: 170,
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)}>
            修改
          </Button>
          <Popconfirm title="確定刪除這筆資料？" onConfirm={() => handleDelete(record.id)}>
            <Button danger icon={<DeleteOutlined />}>
              刪除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout className="page-layout">
      <Header className="page-header">
        <Title level={3} className="header-title">
          React Ant Design + SQLite 學生資料管理
        </Title>
      </Header>

      <Content className="page-content">
        <Card className="intro-card">
          <Title level={4}>範例重點</Title>
          <Paragraph>
            本範例使用 React + Ant Design 建立前端介面，Express 建立 API，SQLite 儲存學生資料。
          </Paragraph>
          <Alert
            type="info"
            showIcon
            message="資料會儲存在 server/students.sqlite，重新整理網頁後資料仍會保留。"
          />
        </Card>

        <div className="main-grid">
          <Card className="form-card" title="新增學生資料">
            <Form form={form} layout="vertical" onFinish={handleAdd}>
              <Form.Item name="student_id" label="學號" rules={[{ required: true, message: '請輸入學號' }]}>
                <Input prefix={<UserOutlined />} placeholder="例如：S004" />
              </Form.Item>
              <Form.Item name="name" label="姓名" rules={[{ required: true, message: '請輸入姓名' }]}>
                <Input placeholder="請輸入姓名" />
              </Form.Item>
              <Form.Item name="department" label="系所" rules={[{ required: true, message: '請選擇系所' }]}>
                <Select
                  placeholder="請選擇系所"
                  options={[
                    { value: '智慧商務系', label: '智慧商務系' },
                    { value: '資訊管理系', label: '資訊管理系' },
                    { value: '電子商務系', label: '電子商務系' },
                  ]}
                />
              </Form.Item>
              <Form.Item name="course" label="課程" rules={[{ required: true, message: '請輸入課程' }]}>
                <Input placeholder="例如：React 與 Ant Design" />
              </Form.Item>
              <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: '請輸入正確 Email' }]}>
                <Input placeholder="student@example.com" />
              </Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                  新增
                </Button>
                <Button onClick={() => form.resetFields()} icon={<ReloadOutlined />}>
                  清空
                </Button>
              </Space>
            </Form>
          </Card>

          <Card className="table-card" title="學生資料查詢與維護">
            <Space className="toolbar" wrap>
              <Input.Search
                className="search-box"
                placeholder="輸入姓名、學號、系所、課程或 Email"
                allowClear
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onSearch={(value) => fetchStudents(value)}
                enterButton={<><SearchOutlined /> 查詢</>}
              />
              <Button onClick={() => { setKeyword(''); fetchStudents(''); }} icon={<ReloadOutlined />}>
                顯示全部
              </Button>
              <Text type="secondary">目前共 {students.length} 筆</Text>
            </Space>

            <Table
              className="student-table"
              rowKey="id"
              loading={loading}
              dataSource={students}
              columns={columns}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 900 }}
            />
          </Card>
        </div>

        <Modal
          title="修改學生資料"
          open={isModalOpen}
          onOk={handleUpdate}
          onCancel={() => setIsModalOpen(false)}
          okText="儲存修改"
          cancelText="取消"
        >
          <Form form={editForm} layout="vertical">
            <Form.Item name="student_id" label="學號" rules={[{ required: true, message: '請輸入學號' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="name" label="姓名" rules={[{ required: true, message: '請輸入姓名' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="department" label="系所" rules={[{ required: true, message: '請選擇系所' }]}>
              <Select
                options={[
                  { value: '智慧商務系', label: '智慧商務系' },
                  { value: '資訊管理系', label: '資訊管理系' },
                  { value: '電子商務系', label: '電子商務系' },
                ]}
              />
            </Form.Item>
            <Form.Item name="course" label="課程" rules={[{ required: true, message: '請輸入課程' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: '請輸入正確 Email' }]}>
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}

export default App;
