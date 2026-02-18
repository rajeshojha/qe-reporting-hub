import { useState } from 'react';
import { Layout, Form, Input, Button, Card, Row, Col, Typography, message, Space, Select, Divider } from 'antd';
import { ArrowLeftOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { sendTestCompletionEmail } from '../services/api';

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TestCompletionForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        recipients: values.recipients.split(',').map(r => r.trim()),
        ccRecipients: values.ccRecipients ? values.ccRecipients.split(',').map(r => r.trim()) : [],
        bccRecipients: values.bccRecipients ? values.bccRecipients.split(',').map(r => r.trim()) : [],
        subject: values.subject,
        projectName: values.projectName,
        riskStatus: values.riskStatus,
        testEnvironment: values.testEnvironment,
        completionDate: values.completionDate,
        overallStatus: values.overallStatus,
        totalTestCases: parseInt(values.totalTestCases),
        passedTestCases: parseInt(values.passedTestCases),
        failedTestCases: parseInt(values.failedTestCases),
        blockedTestCases: parseInt(values.blockedTestCases),
        remarks: values.remarks,
      };

      await sendTestCompletionEmail(payload);
      message.success('Test completion email sent successfully!');
      form.resetFields();
    } catch (error) {
      const errorMsg = error.message || 'Failed to send email';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 50px' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ color: 'white', marginRight: '20px' }}
          />
          <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
            Test Completion Report Form
          </div>
        </div>
      </Header>

      <Content style={{ padding: '50px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                totalTestCases: 0,
                passedTestCases: 0,
                failedTestCases: 0,
                blockedTestCases: 0,
              }}
            >
              <Title level={4}>Email Recipients</Title>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="To (comma-separated)"
                    name="recipients"
                    rules={[{ required: true, message: 'Please enter recipients' }]}
                  >
                    <Input placeholder="email1@example.com, email2@example.com" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="CC (comma-separated)" name="ccRecipients">
                    <Input placeholder="email1@example.com, email2@example.com" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="BCC (comma-separated)" name="bccRecipients">
                    <Input placeholder="email1@example.com, email2@example.com" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={4}>Report Information</Title>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Please enter subject' }]}
                  >
                    <Input placeholder="E2E Testing Completion Report" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Project Name"
                    name="projectName"
                    rules={[{ required: true, message: 'Please enter project name' }]}
                  >
                    <Input placeholder="My Project" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Sprint/Version"
                    name="riskStatus"
                    rules={[{ required: true, message: 'Please enter sprint/version' }]}
                  >
                    <Input placeholder="Sprint 23" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Test Environment"
                    name="testEnvironment"
                    rules={[{ required: true, message: 'Please enter test environment' }]}
                  >
                    <Input placeholder="Production" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Completion Date"
                    name="completionDate"
                    rules={[{ required: true, message: 'Please enter completion date' }]}
                  >
                    <Input placeholder="2026-02-14" />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Title level={4}>Test Results</Title>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    label="Overall Status"
                    name="overallStatus"
                    rules={[{ required: true, message: 'Please select overall status' }]}
                  >
                    <Select placeholder="Select status">
                      <Option value="Completed">Completed</Option>
                      <Option value="Completed with Issues">Completed with Issues</Option>
                      <Option value="Partially Completed">Partially Completed</Option>
                      <Option value="Failed">Failed</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Total Test Cases"
                    name="totalTestCases"
                    rules={[{ required: true, message: 'Please enter total test cases' }]}
                  >
                    <Input type="number" min={0} placeholder="100" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Passed Test Cases"
                    name="passedTestCases"
                    rules={[{ required: true, message: 'Please enter passed test cases' }]}
                  >
                    <Input type="number" min={0} placeholder="85" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Failed Test Cases"
                    name="failedTestCases"
                    rules={[{ required: true, message: 'Please enter failed test cases' }]}
                  >
                    <Input type="number" min={0} placeholder="10" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Blocked Test Cases"
                    name="blockedTestCases"
                    rules={[{ required: true, message: 'Please enter blocked test cases' }]}
                  >
                    <Input type="number" min={0} placeholder="5" />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="Remarks"
                    name="remarks"
                    rules={[{ required: true, message: 'Please enter remarks' }]}
                  >
                    <TextArea 
                      rows={6} 
                      placeholder="Enter detailed remarks about the test completion, known issues, recommendations, etc."
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    size="large"
                  >
                    Send Email
                  </Button>
                  <Button size="large" onClick={() => form.resetFields()}>
                    Reset
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default TestCompletionForm;
