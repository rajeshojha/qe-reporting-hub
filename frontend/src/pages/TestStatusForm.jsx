import { useState } from "react";
import {
  Layout,
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Typography,
  message,
  Space,
  Select,
  InputNumber,
  Divider,
  Table,
  Spin,
  Modal,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SendOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { sendTestStatusEmail } from "../services/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Custom styles for ReactQuill editor and tables
const editorStyle = `
  .quill-editor-wrapper .ql-container {
    font-size: 14px;
    min-height: 150px;
    background: #FAFBFD;
    border: 1px solid #E3EAF5;
    border-radius: 0 0 10px 10px;

  }
  .quill-editor-wrapper .ql-editor {
    min-height: 150px;
  }
  .quill-editor-wrapper .ql-toolbar {
    background: #F1F5F9;
    border: 1px solid #F1F5F9;
    border-radius: 10px 10px 0 0;
  }
  .ant-table-thead > tr > th {
    background: #F1F5F9 !important;
    color: #374151 !important;
    font-weight: 600 !important;
  }
  .ant-table-tbody > tr > td {
    background: #FAFBFD !important;
    border-bottom: 1px solid #EEF2F7 !important;
  }
`;

const { Header, Content } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const TestStatusForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [defects, setDefects] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [accessibilityResults, setAccessibilityResults] = useState([]);
  const [incidentResults, setIncidentResults] = useState([]);
  const [a11yMetrics, setA11yMetrics] = useState([]);
  const [keyCalloutsHtml, setKeyCalloutsHtml] = useState("");

  const handleSubmit = async (values) => {
    // Show confirmation modal before sending
    Modal.confirm({
      title: "Confirm Report Submission",
      content: "Are you sure you want to send this report via email?",
      width: 520,
      okText: "Send Email",
      cancelText: "Cancel",
      bodyStyle: { padding: "24px 12px" },
      okButtonProps: {
        style: {
          background: "linear-gradient(135deg, #2563EB, #1E4FD8)",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontWeight: "600",
          height: "40px",
          padding: "0 20px",
        },
      },
      cancelButtonProps: {
        style: {
          background: "#F1F5F9",
          color: "#374151",
          border: "1px solid #D1D9E6",
          borderRadius: "8px",
          fontWeight: "500",
          height: "40px",
          padding: "0 20px",
        },
      },
      onOk: async () => {
        setLoading(true);
        try {
          // Convert HTML content to array of HTML strings (each <p> or <li> as separate item)
          const parser = new DOMParser();
          const doc = parser.parseFromString(keyCalloutsHtml, "text/html");
          const elements = doc.body.children;
          const calloutsArray = Array.from(elements)
            .map((el) => el.outerHTML)
            .filter((html) => {
              // Remove empty elements and elements with only whitespace/breaks
              const tempDiv = document.createElement("div");
              tempDiv.innerHTML = html;
              const textContent =
                tempDiv.textContent || tempDiv.innerText || "";
              return textContent.trim().length > 0;
            });

          // Construct subject from form values
          const subject = `${values.vertical} | ${values.projectName} | ${values.opifId} | E2E Testing Daily Status - [${values.reportDate}]`;

          const payload = {
            senderEmail: values.senderEmail,
            recipients: values.recipients.split(",").map((r) => r.trim()),
            ccRecipients: values.ccRecipients
              ? values.ccRecipients.split(",").map((r) => r.trim())
              : [],
            bccRecipients: values.bccRecipients
              ? values.bccRecipients.split(",").map((r) => r.trim())
              : [],
            subject: subject,
            projectName: values.projectName,
            riskStatus: values.riskStatus,
            reportDate: values.reportDate,
            programManagerName: values.programManagerName,
            passRatePercentage: values.passRatePercentage,
            attemptRatePercentage: values.attemptRatePercentage,
            criticalP1Count: values.criticalP1Count,
            keyCallouts: calloutsArray.length > 0 ? calloutsArray : [],
            e2eJiraFilterLink: values.e2eJiraFilterLink || "",
            a11yJiraFilterLink: values.a11yJiraFilterLink || "",
            e2eConfluenceLink: values.e2eConfluenceLink || "",
            defects,
            testCases,
            accessibilityResults,
            a11yMetrics,
            thankYouNames: values.thankYouNames
              ? values.thankYouNames
                  .split(",")
                  .map((n) => n.trim())
                  .filter((n) => n)
              : [],
          };

          await sendTestStatusEmail(payload);

          form.resetFields();
          setDefects([]);
          setTestCases([]);
          setAccessibilityResults([]);
          setA11yMetrics([]);
          setKeyCalloutsHtml("");

          // Show success modal with OK button
          Modal.success({
            title: "Report Sent Successfully",
            content:
              "The E2E daily status report has been successfully emailed to the recipients.",
            width: 520,
            bodyStyle: { padding: "24px 12px" },
            okText: "Return to Home",
            okButtonProps: {
              style: {
                background: "linear-gradient(135deg, #2563EB, #1E4FD8)",
                border: "none",
                borderRadius: "8px",
                fontWeight: 600,
                height: "42px",
                padding: "0 28px",
                color: "white",
              },
            },
            onOk: () => {
              navigate("/");
            },
          });
        } catch (error) {
          const errorMsg = error.message || "Failed to send email";
          message.error(errorMsg);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  // Defects Table Columns
  const defectColumns = [
    { title: "Key", dataIndex: "bugId", key: "bugId", width: 100 },
    { title: "Priority", dataIndex: "priority", key: "priority", width: 80 },
    {
      title: "Current Owner",
      dataIndex: "currentOwner",
      key: "currentOwner",
      width: 120,
    },
    { title: "Manager", dataIndex: "manager", key: "manager", width: 120 },
    { title: "Director", dataIndex: "director", key: "director", width: 120 },
    { title: "SD/GD", dataIndex: "sdGd", key: "sdGd", width: 100 },
    {
      title: "Planned Done Date",
      dataIndex: "plannedDoneDate",
      key: "plannedDoneDate",
      width: 130,
    },
    { title: "Status", dataIndex: "status", key: "status", width: 100 },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            setDefects(defects.filter((d) => d.key !== record.key))
          }
        />
      ),
    },
  ];

  // Test Cases Table Columns
  const testCaseColumns = [
    { title: "TC ID", dataIndex: "tcId", key: "tcId", width: 120 },
    {
      title: "Overall Status",
      dataIndex: "overallStatus",
      key: "overallStatus",
      width: 150,
    },
    { title: "Android", dataIndex: "android", key: "android", width: 120 },
    { title: "iOS", dataIndex: "ios", key: "ios", width: 120 },
    { title: "dWeb", dataIndex: "dWeb", key: "dWeb", width: 120 },
    { title: "mWeb", dataIndex: "mWeb", key: "mWeb", width: 120 },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            setTestCases(testCases.filter((tc) => tc.key !== record.key))
          }
        />
      ),
    },
  ];

  // Accessibility Results Table Columns
  const a11yColumns = [
    { title: "Key", dataIndex: "bugId", key: "bugId", width: 100 },
    { title: "Priority", dataIndex: "priority", key: "priority", width: 80 },
    {
      title: "Current Owner",
      dataIndex: "currentOwner",
      key: "currentOwner",
      width: 120,
    },
    { title: "Manager", dataIndex: "manager", key: "manager", width: 120 },
    { title: "Director", dataIndex: "director", key: "director", width: 120 },
    { title: "SD/GD", dataIndex: "sdGd", key: "sdGd", width: 100 },
    {
      title: "Planned Done Date",
      dataIndex: "plannedDoneDate",
      key: "plannedDoneDate",
      width: 130,
    },
    { title: "Status", dataIndex: "status", key: "status", width: 100 },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            setAccessibilityResults(
              accessibilityResults.filter((a) => a.key !== record.key),
            )
          }
        />
      ),
    },
  ];

  const teflonColumns = [
    { title: "Key", dataIndex: "bugId", key: "bugId", width: 100 },
    { title: "Priority", dataIndex: "priority", key: "priority", width: 80 },
    {
      title: "Current Owner",
      dataIndex: "currentOwner",
      key: "currentOwner",
      width: 120,
    },
    { title: "Manager", dataIndex: "manager", key: "manager", width: 120 },
    { title: "Director", dataIndex: "director", key: "director", width: 120 },
    { title: "SD/GD", dataIndex: "sdGd", key: "sdGd", width: 100 },
    {
      title: "Planned Done Date",
      dataIndex: "plannedDoneDate",
      key: "plannedDoneDate",
      width: 130,
    },
    { title: "Status", dataIndex: "status", key: "status", width: 100 },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            setIncidentResults(
              incidentResults.filter((i) => i.key !== record.key),
            )
          }
        />
      ),
    },
  ];

  const [defectForm] = Form.useForm();
  const [testCaseForm] = Form.useForm();
  const [a11yForm] = Form.useForm();
  const [teflonForm] = Form.useForm();
  const [a11yMetricsForm] = Form.useForm();

  const addDefect = () => {
    defectForm.validateFields().then((values) => {
      setDefects([...defects, { key: Date.now(), ...values }]);
      defectForm.resetFields();
    });
  };

  const addTestCase = () => {
    testCaseForm.validateFields().then((values) => {
      setTestCases([...testCases, { key: Date.now(), ...values }]);
      testCaseForm.resetFields();
    });
  };

  const addA11yResult = () => {
    a11yForm.validateFields().then((values) => {
      setAccessibilityResults([
        ...accessibilityResults,
        { key: Date.now(), ...values },
      ]);
      a11yForm.resetFields();
    });
  };

  const addTeflonResult = () => {
    teflonForm.validateFields().then((values) => {
      setIncidentResults([...incidentResults, { key: Date.now(), ...values }]);
      teflonForm.resetFields();
    });
  };

  // A11Y Metrics Table Columns
  const a11yMetricsColumns = [
    { title: "Platform", dataIndex: "platform", key: "platform", width: 120 },
    {
      title: "Attempted %",
      dataIndex: "attemptedPercentage",
      key: "attemptedPercentage",
      width: 120,
    },
    {
      title: "Pass %",
      dataIndex: "passPercentage",
      key: "passPercentage",
      width: 120,
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      ellipsis: true,
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() =>
            setA11yMetrics(a11yMetrics.filter((m) => m.key !== record.key))
          }
        />
      ),
    },
  ];

  const addA11yMetric = () => {
    a11yMetricsForm.validateFields().then((values) => {
      setA11yMetrics([...a11yMetrics, { key: Date.now(), ...values }]);
      a11yMetricsForm.resetFields();
    });
  };

  return (
    <Spin spinning={loading} tip="Sending email..." size="large">
      <Layout
        style={{
          minHeight: "100vh",
          filter: loading ? "blur(2px)" : "none",
          transition: "filter 0.3s",
        }}
      >
        <style>{editorStyle}</style>
        <Header style={{ background: "#FFFFFF", padding: "0 50px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/")}
              style={{ color: "black", marginRight: "20px" }}
            />
            <div
              style={{ color: "black", fontSize: "20px", fontWeight: "bold" }}
            >
              E2E Daily Status Form
            </div>
          </div>
        </Header>

        <Content style={{ padding: "50px", background: "#F5F7FB" }}>
          <div style={{ maxWidth: "75vw", margin: "0 auto" }}>
            <Card
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5EAF2",
                borderRadius: "16px",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.04)",
                padding: "32px",
              }}
            >
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Project Details
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Required)
                  </span>
                </div>
                <Row gutter={16}>
                  <Col span={4}>
                    <Form.Item
                      label="Vertical / Track"
                      name="vertical"
                      rules={[
                        {
                          required: true,
                          message: "Please enter vertical / track",
                        },
                      ]}
                    >
                      <Input
                        style={{ borderColor: "#D1D9E6" }}
                        placeholder="Fulfilment"
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item
                      label="Project Name"
                      name="projectName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter project name",
                        },
                      ]}
                    >
                      <Input placeholder="Local Finds Alcohol - MVP Payments Fast follows" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item
                      label="OPIF ID"
                      name="opifId"
                      rules={[
                        { required: true, message: "Please enter OPIF ID" },
                      ]}
                    >
                      <Input placeholder="OPIF-12345" />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item
                      label="Report Date"
                      name="reportDate"
                      rules={[
                        { required: true, message: "Please enter report date" },
                      ]}
                    >
                      <Input placeholder="07/14" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="Program Manager Name"
                      name="programManagerName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter program manager name",
                        },
                      ]}
                    >
                      <Input placeholder="John Doe" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ marginTop: 0 }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    E2E Testing Status
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Required)
                  </span>
                </div>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item
                      label="Risk Status"
                      name="riskStatus"
                      rules={[
                        {
                          required: true,
                          message: "Please select risk status",
                        },
                      ]}
                    >
                      <Select placeholder="Select Risk Status">
                        <Option value="On Track">On Track</Option>
                        <Option value="At Medium Risk">At Medium Risk</Option>
                        <Option value="At High Risk">At High Risk</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="Pass Rate %"
                      name="passRatePercentage"
                      rules={[
                        {
                          required: true,
                          message: "Please enter pass rate percentage",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="Attempted %"
                      name="attemptRatePercentage"
                      rules={[
                        {
                          required: true,
                          message: "Please enter attempted percentage",
                        },
                      ]}
                    >
                      <InputNumber
                        min={0}
                        max={100}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item
                      label="Critical P1 Count"
                      name="criticalP1Count"
                      rules={[
                        {
                          required: true,
                          message: "Please enter critical P1 count",
                        },
                      ]}
                    >
                      <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ marginTop: 0 }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Key Callouts
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Optional)
                  </span>
                </div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item>
                      <div className="quill-editor-wrapper">
                        <ReactQuill
                          theme="snow"
                          value={keyCalloutsHtml}
                          onChange={setKeyCalloutsHtml}
                          modules={{
                            toolbar: [
                              ["bold", "underline"],
                              [{ color: [] }],
                              ["link"],
                              [{ list: "bullet" }],
                            ],
                          }}
                          placeholder="Enter key callouts here in bullet points."
                        />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ marginTop: 0 }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Details: E2E Critical Defects
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Optional)
                  </span>
                </div>
                <Form.Item
                  label="Jira Filter Link"
                  name="e2eJiraFilterLink"
                  style={{ marginTop: "8px" }}
                >
                  <Input placeholder="https://jira.example.com/issues/?filter=12345" />
                </Form.Item>
                <Card
                  size="small"
                  style={{ marginBottom: 16, background: "#f5f5f5" }}
                >
                  <Form form={defectForm} layout="inline">
                    <Form.Item
                      name="bugId"
                      label="Key"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="CEPG-12345" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      name="priority"
                      label="Priority"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 80 }}>
                        <Option value="P1">P1</Option>
                        <Option value="P2">P2</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="currentOwner"
                      label="Current Owner"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="John Doe" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="manager" label="Manager">
                      <Input placeholder="Manager" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="director" label="Director">
                      <Input placeholder="Director" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="sdGd" label="SD/GD">
                      <Input placeholder="SD/GD" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="plannedDoneDate" label="Planned Done Date">
                      <Input placeholder="07/14" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 150 }}>
                        <Option value="Backlog">Backlog</Option>
                        <Option value="WIP">WIP</Option>
                        <Option value="Test">Test</Option>
                        <Option value="Done">Done</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addDefect}
                    >
                      Add
                    </Button>
                  </Form>
                </Card>
                <Table
                  columns={defectColumns}
                  dataSource={defects}
                  pagination={false}
                  size="small"
                  scroll={{ x: 1000 }}
                />

                <Divider />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Details: ADA Critical Defects
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Optional)
                  </span>
                </div>
                <Form.Item
                  label="Jira Filter Link"
                  name="a11yJiraFilterLink"
                  style={{ marginTop: "8px" }}
                >
                  <Input placeholder="https://jira.example.com/issues/?filter=12345" />
                </Form.Item>
                <Card
                  size="small"
                  style={{ marginBottom: 16, background: "#f5f5f5" }}
                >
                  <Form form={a11yForm} layout="inline">
                    <Form.Item
                      name="bugId"
                      label="Key"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="CEPG-1234" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      name="priority"
                      label="Priority"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 80 }}>
                        <Option value="P1">P1</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="currentOwner"
                      label="Current Owner"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="John Doe" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="manager" label="Manager">
                      <Input placeholder="Manager" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="director" label="Director">
                      <Input placeholder="Director" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="sdGd" label="SD/GD">
                      <Input placeholder="SD/GD" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="plannedDoneDate" label="Planned Done Date">
                      <Input placeholder="7/14" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 150 }}>
                        <Option value="Backlog">Backlog</Option>
                        <Option value="WIP">WIP</Option>
                        <Option value="Test">Test</Option>
                        <Option value="Done">Done</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addA11yResult}
                    >
                      Add
                    </Button>
                  </Form>
                </Card>
                <Table
                  columns={a11yColumns}
                  dataSource={accessibilityResults}
                  pagination={false}
                  size="small"
                  scroll={{ x: 1000 }}
                />

                <Divider />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Details: Teflon P1 Incidents
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Optional)
                  </span>
                </div>
                <Card
                  size="small"
                  style={{
                    marginTop: "8px",
                    marginBottom: 16,
                    background: "#f5f5f5",
                  }}
                >
                  <Form form={teflonForm} layout="inline">
                    <Form.Item
                      name="bugId"
                      label="Key"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="CEPG-1234" style={{ width: 150 }} />
                    </Form.Item>
                    <Form.Item
                      name="priority"
                      label="Priority"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="P1" style={{ width: 80 }}>
                        <Option value="P1">P1</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="currentOwner"
                      label="Current Owner"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="John Doe" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="manager" label="Manager">
                      <Input placeholder="Manager" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="director" label="Director">
                      <Input placeholder="Director" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="sdGd" label="SD/GD">
                      <Input placeholder="SD/GD" style={{ width: 180 }} />
                    </Form.Item>
                    <Form.Item name="plannedDoneDate" label="Planned Done Date">
                      <Input placeholder="7/14" style={{ width: 80 }} />
                    </Form.Item>
                    <Form.Item
                      name="status"
                      label="Status"
                      rules={[{ required: true }]}
                    >
                      <Select style={{ width: 150 }}>
                        <Option value="Backlog">Backlog</Option>
                        <Option value="WIP">WIP</Option>
                        <Option value="Test">Test</Option>
                        <Option value="Done">Done</Option>
                      </Select>
                    </Form.Item>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addTeflonResult}
                    >
                      Add
                    </Button>
                  </Form>
                </Card>
                <Table
                  columns={teflonColumns}
                  dataSource={incidentResults}
                  pagination={false}
                  size="small"
                  scroll={{ x: 1000 }}
                />

                <Divider />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Details E2E Golden Flows
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Required)
                  </span>
                </div>
                <Form.Item
                  label="E2E Confluence Link"
                  name="e2eConfluenceLink"
                  style={{ marginTop: "8px" }}
                  rules={[
                    { required: true, message: "Please enter Confluence link" },
                  ]}
                >
                  <Input placeholder="https://confluence.example.com/pages/viewpage.action?pageId=12345" />
                </Form.Item>
                <Card
                  size="small"
                  style={{ marginBottom: 16, background: "#f5f5f5" }}
                >
                  <Form form={testCaseForm} layout="inline">
                    <Form.Item
                      name="tcId"
                      label="TC ID"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="TC-001" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                      name="overallStatus"
                      label="Overall Status"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Pass" style={{ width: 120 }}>
                        <Option value="Pass">Pass</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Fail">Fail</Option>
                        <Option value="Not Attempted">Not Attempted</Option>
                        <Option value="N/A">N/A</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="android"
                      label="Android"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Pass" style={{ width: 120 }}>
                        <Option value="Pass">Pass</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Fail">Fail</Option>
                        <Option value="Not Attempted">Not Attempted</Option>
                        <Option value="N/A">N/A</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="ios"
                      label="iOS"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Pass" style={{ width: 120 }}>
                        <Option value="Pass">Pass</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Fail">Fail</Option>
                        <Option value="Not Attempted">Not Attempted</Option>
                        <Option value="N/A">N/A</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="dWeb"
                      label="dWeb"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Pass" style={{ width: 120 }}>
                        <Option value="Pass">Pass</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Fail">Fail</Option>
                        <Option value="Not Attempted">Not Attempted</Option>
                        <Option value="N/A">N/A</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="mWeb"
                      label="mWeb"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Pass" style={{ width: 120 }}>
                        <Option value="Pass">Pass</Option>
                        <Option value="In Progress">In Progress</Option>
                        <Option value="Fail">Fail</Option>
                        <Option value="Not Attempted">Not Attempted</Option>
                        <Option value="N/A">N/A</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="comments" label="Comments">
                      <Input
                        placeholder="Additional notes"
                        style={{ width: 200 }}
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addTestCase}
                    >
                      Add
                    </Button>
                  </Form>
                </Card>
                <Table
                  columns={testCaseColumns}
                  dataSource={testCases}
                  pagination={false}
                  size="small"
                  scroll={{ x: 800 }}
                />

                <Divider />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Details A11Y
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Optional)
                  </span>
                </div>
                <Card
                  size="small"
                  style={{
                    marginTop: "8px",
                    marginBottom: 16,
                    background: "#f5f5f5",
                  }}
                >
                  <Form form={a11yMetricsForm} layout="inline">
                    <Form.Item
                      name="platform"
                      label="Platform"
                      rules={[{ required: true }]}
                    >
                      <Select placeholder="Android" style={{ width: 120 }}>
                        <Option value="Android">Android</Option>
                        <Option value="iOS">iOS</Option>
                        <Option value="Web">Web</Option>
                        <Option value="SmartComms">SmartComms</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="attemptedPercentage"
                      label="Attempted %"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="85 or N/A" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item
                      name="passPercentage"
                      label="Pass %"
                      rules={[{ required: true }]}
                    >
                      <Input placeholder="90 or N/A" style={{ width: 100 }} />
                    </Form.Item>
                    <Form.Item name="comments" label="Comments">
                      <Input
                        placeholder="Additional notes"
                        style={{ width: 250 }}
                      />
                    </Form.Item>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={addA11yMetric}
                    >
                      Add
                    </Button>
                  </Form>
                </Card>
                <Table
                  columns={a11yMetricsColumns}
                  dataSource={a11yMetrics}
                  pagination={false}
                  size="small"
                  scroll={{ x: 600 }}
                />

                <Divider />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Thanks
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Required)
                  </span>
                </div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label={
                        <span>
                          Names (comma-separated).{" "}
                          <span style={{ color: "#D97706" }}>
                            Do not include any additional text like 'Thanks' or
                            'Thank you' or 'Regards'.
                          </span>
                        </span>
                      }
                      name="thankYouNames"
                    >
                      <TextArea
                        rows={2}
                        placeholder="John Doe, Jane Smith, E2E Team"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ marginTop: 60 }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Sender Email
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Required)
                  </span>
                </div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="From Email Address"
                      name="senderEmail"
                      rules={[
                        {
                          required: true,
                          message: "Please enter sender email address",
                        },
                        {
                          type: "email",
                          message: "Please enter a valid email address",
                        },
                        {
                          pattern: /@walmart\.com$/,
                          message: "Email must be from @walmart.com domain",
                        },
                      ]}
                    >
                      <Input placeholder="your.email@walmart.com" />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider style={{ marginTop: 0 }} />

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <Title
                    style={{
                      color: "#111827",
                      fontWeight: 600,
                      fontSize: 18,
                      marginBottom: 0,
                    }}
                  >
                    Email Recipients
                  </Title>
                  <span style={{ fontSize: "14px", color: "#6B7280" }}>
                    (Required)
                  </span>
                </div>
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="To (comma-separated)"
                      name="recipients"
                      rules={[
                        { required: true, message: "Please enter recipients" },
                      ]}
                    >
                      <Input placeholder="email1@example.com, email2@example.com" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="CC (comma-separated)" name="ccRecipients">
                      <Input placeholder="email1@example.com, email2@example.com" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="BCC (comma-separated)"
                      name="bccRecipients"
                    >
                      <Input placeholder="email1@example.com, email2@example.com" />
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
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(37, 99, 235, 0.25)";
                        e.currentTarget.style.filter = "brightness(1.03)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(0, 0, 0, 0.15)";
                        e.currentTarget.style.filter = "brightness(1)";
                      }}
                      size="large"
                      style={{
                        fontSize: "15px",
                        background: "linear-gradient(135deg, #2563EB, #1E4FD8)",
                        color: "white",
                        border: "none",
                        marginTop: "24px",
                        width: "100%",
                        height: "48px",
                        fontWeight: "600",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        padding: "0 25px",
                      }}
                    >
                      Send Email
                    </Button>
                    <Button
                      icon={<ReloadOutlined />}
                      size="large"
                      onClick={() => form.resetFields()}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#E5EAF2";
                        e.currentTarget.style.borderColor = "#C7D2E2";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#F1F5F9";
                        e.currentTarget.style.borderColor = "#D1D9E6";
                      }}
                      style={{
                        fontSize: "15px",
                        marginTop: "24px",
                        width: "100%",
                        height: "48px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                        padding: "0 25px",
                        background: "#F1F5F9",
                        color: "#374151",
                        border: "1px solid #D1D9E6",
                        borderRadius: "10px",
                        fontWeight: 500,
                        transition: "background 0.2s, border-color 0.2s",
                      }}
                    >
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          </div>
        </Content>
      </Layout>
    </Spin>
  );
};

export default TestStatusForm;
