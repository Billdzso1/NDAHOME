"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

// =====================================================
// 1. KHAI BÁO KIỂU DỮ LIỆU
// =====================================================

type Transaction = {
  id: number;
  date: string;
  name: string;
  category: string;
  project: string;
  paymentMethod: "Tiền mặt" | "Chuyển khoản";
  type: "Thu" | "Chi";
  amount: number;
};

type PageKey =
  | "overview"
  | "transactions"
  | "reports"
  | "categories"
  | "projects"
  | "settings";

type Project = {
  name: string;
  customer: string;
  budget: number;
  status: string;
};

const initialTransactions: Transaction[] = [
  { id: 1, date: "2026-06-10", name: "Thanh toán hợp đồng nội thất", category: "Doanh thu", project: "Công trình A", paymentMethod: "Chuyển khoản", type: "Thu", amount: 85000000 },
  { id: 2, date: "2026-06-11", name: "Mua vật liệu xây dựng", category: "Vật tư", project: "Công trình A", paymentMethod: "Chuyển khoản", type: "Chi", amount: 25000000 },
  { id: 3, date: "2026-07-13", name: "Khách hàng đặt cọc", category: "Đặt cọc", project: "Công trình B", paymentMethod: "Chuyển khoản", type: "Thu", amount: 40000000 },
  { id: 4, date: "2026-07-14", name: "Thanh toán nhân công", category: "Nhân sự", project: "Công trình B", paymentMethod: "Tiền mặt", type: "Chi", amount: 12000000 },
  { id: 5, date: "2026-08-15", name: "Thi công công trình A", category: "Doanh thu", project: "Công trình A", paymentMethod: "Chuyển khoản", type: "Thu", amount: 30000000 },
  { id: 6, date: "2026-08-18", name: "Mua gỗ công nghiệp", category: "Vật tư", project: "Công trình A", paymentMethod: "Chuyển khoản", type: "Chi", amount: 18000000 },
  { id: 7, date: "2026-09-05", name: "Thanh toán đợt 2", category: "Doanh thu", project: "Công trình B", paymentMethod: "Chuyển khoản", type: "Thu", amount: 65000000 },
  { id: 8, date: "2026-09-09", name: "Chi phí vận chuyển", category: "Vận chuyển", project: "Công trình B", paymentMethod: "Tiền mặt", type: "Chi", amount: 9000000 },
  { id: 9, date: "2026-10-12", name: "Khách hàng đặt cọc công trình B", category: "Đặt cọc", project: "Công trình B", paymentMethod: "Chuyển khoản", type: "Thu", amount: 55000000 },
  { id: 10, date: "2026-10-16", name: "Thanh toán nhân công", category: "Nhân sự", project: "Công trình C", paymentMethod: "Tiền mặt", type: "Chi", amount: 15000000 },
  { id: 11, date: "2026-11-10", name: "Thanh toán hợp đồng nội thất", category: "Doanh thu", project: "Công trình A", paymentMethod: "Chuyển khoản", type: "Thu", amount: 85000000 },
  { id: 12, date: "2026-11-11", name: "Mua vật liệu xây dựng", category: "Vật tư", project: "Công trình C", paymentMethod: "Chuyển khoản", type: "Chi", amount: 25000000 },
  { id: 13, date: "2026-11-13", name: "Khách hàng đặt cọc", category: "Đặt cọc", project: "Công trình C", paymentMethod: "Tiền mặt", type: "Thu", amount: 40000000 },
  { id: 14, date: "2026-11-14", name: "Thanh toán nhân công", category: "Nhân sự", project: "Công trình A", paymentMethod: "Tiền mặt", type: "Chi", amount: 12000000 },
  { id: 15, date: "2026-11-15", name: "Thi công công trình A", category: "Doanh thu", project: "Công trình A", paymentMethod: "Chuyển khoản", type: "Thu", amount: 30000000 },
];

const initialProjects: Project[] = [
  {
    name: "Công trình A",
    customer: "Khách hàng Nguyễn Văn A",
    budget: 250000000,
    status: "Đang thi công",
  },
  {
    name: "Công trình B",
    customer: "Khách hàng Trần Văn B",
    budget: 180000000,
    status: "Hoàn thành",
  },
  {
    name: "Công trình C",
    customer: "Khách hàng Lê Văn C",
    budget: 45000000,
    status: "Đang thi công",
  },
];

const money = (value: number) =>
  value.toLocaleString("vi-VN") + " ₫";

const shortMoney = (value: number) => {
  if (value === 0) return "";
  if (value >= 1000000) return `${Math.round(value / 1000000)}tr`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
};

function getToday() {
  return "2026-11-16";
}

const pageTitles: Record<PageKey, string> = {
  overview: "Tổng quan",
  transactions: "Giao dịch",
  reports: "Báo cáo tài chính",
  categories: "Danh mục thu chi",
  projects: "Công trình",
  settings: "Cài đặt",
};

const menuGroups = [
  {
    label: "MENU CHÍNH",
    items: [
      { key: "overview" as PageKey, icon: "▦", label: "Tổng quan" },
      { key: "transactions" as PageKey, icon: "⇄", label: "Giao dịch" },
      { key: "reports" as PageKey, icon: "▥", label: "Báo cáo tài chính" },
    ],
  },
  {
    label: "QUẢN LÝ",
    items: [
      { key: "categories" as PageKey, icon: "▣", label: "Danh mục thu chi" },
      { key: "projects" as PageKey, icon: "⌂", label: "Công trình" },
      { key: "settings" as PageKey, icon: "⚙", label: "Cài đặt" },
    ],
  },
];

// =====================================================
// 2. BIỂU ĐỒ TRÒN
// =====================================================

function PieChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  const colors = [
    "#c9a43b",
    "#333333",
    "#159b68",
    "#e47755",
    "#7d86c9",
    "#b28ac8",
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  let current = 0;

  const gradient =
    total > 0
      ? data
          .map((item, index) => {
            const start = current;
            current += (item.value / total) * 100;

            return `${colors[index % colors.length]} ${start}% ${current}%`;
          })
          .join(", ")
      : "#eeeeee 0% 100%";

  return (
    <div className="pie-layout">
      <div
        className="pie-chart"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="pie-hole">
          <strong>{money(total)}</strong>
          <span>Tổng chi phí</span>
        </div>
      </div>

      <div className="pie-legend">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div className="legend-row" key={item.name}>
              <span
                className="legend-dot"
                style={{
                  background: colors[index % colors.length],
                }}
              />

              <span className="legend-name">{item.name}</span>

              <strong>
                {total > 0
                  ? Math.round((item.value / total) * 100)
                  : 0}
                %
              </strong>
            </div>
          ))
        ) : (
          <p className="muted">Chưa có dữ liệu khoản chi.</p>
        )}
      </div>
    </div>
  );
}

// =====================================================
// 3. BIỂU ĐỒ CỘT
// =====================================================

function BarChart({
  data,
}: {
  data: { label: string; income: number; expense: number }[];
}) {
  const [hovered, setHovered] = useState<{
    label: string;
    type: "Thu" | "Chi";
    amount: number;
  } | null>(null);

  const max = Math.max(
    1,
    ...data.flatMap((item) => [item.income, item.expense])
  );

  return (
    <div style={{ position: "relative" }}>
      {hovered && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "0",
            background: "#18181b",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: 600,
            boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            zIndex: 5,
          }}
        >
          {hovered.label} ·{" "}
          <span
            style={{
              color: hovered.type === "Thu" ? "#ebd067" : "#f87171",
            }}
          >
            {hovered.type}: {money(hovered.amount)}
          </span>
        </div>
      )}

      <div className="bar-chart-area">
        <div className="bar-axis">
          {[100, 75, 50, 25, 0].map((n) => (
            <span key={n}>{n}%</span>
          ))}
        </div>

        <div className="bar-chart">
          {data.map((item) => (
            <div className="bar-month" key={item.label}>
              <div className="bar-pair">
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flex: 1,
                    maxWidth: "28px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9.5px",
                      color: "#a17d1a",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {shortMoney(item.income)}
                  </span>
                  <div
                    className="bar-column income-column"
                    style={{
                      width: "100%",
                      height: `${(item.income / max) * 88}%`,
                    }}
                    onMouseEnter={() =>
                      setHovered({
                        label: item.label,
                        type: "Thu",
                        amount: item.income,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  />
                </div>

                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    flex: 1,
                    maxWidth: "28px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9.5px",
                      color: "#52525b",
                      fontWeight: 700,
                      marginBottom: "4px",
                    }}
                  >
                    {shortMoney(item.expense)}
                  </span>
                  <div
                    className="bar-column expense-column"
                    style={{
                      width: "100%",
                      height: `${(item.expense / max) * 88}%`,
                    }}
                    onMouseEnter={() =>
                      setHovered({
                        label: item.label,
                        type: "Chi",
                        amount: item.expense,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  />
                </div>
              </div>

              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// 4. COMPONENT CHÍNH
// =====================================================

export default function Home() {
  const [activePage, setActivePage] =
    useState<PageKey>("overview");

  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);

  const [projects, setProjects] =
    useState<Project[]>(initialProjects);

  const [filter, setFilter] = useState("Tất cả");
  const [projectFilter, setProjectFilter] = useState("Tất cả");
  const [methodFilter, setMethodFilter] = useState("Tất cả");
  const [search, setSearch] = useState("");

  // State Modal Thêm / Sửa giao dịch
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // State Modal In Phiếu Thu / Chi
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);

  // State Modal Thêm công trình
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: "",
    customer: "",
    budget: "",
    status: "Đang thi công",
  });

  const [form, setForm] = useState({
    name: "",
    category: "Doanh thu",
    project: "Công trình A",
    paymentMethod: "Chuyển khoản" as "Tiền mặt" | "Chuyển khoản",
    type: "Thu" as "Thu" | "Chi",
    amount: "",
    date: getToday(),
  });

  const [companyName, setCompanyName] = useState("NDA HOME");
  const [adminName, setAdminName] = useState("Admin NDA");

  // Đọc dữ liệu từ localStorage khi mở web
  useEffect(() => {
    const savedTx = localStorage.getItem("ndahome_transactions_v2");
    const savedProj = localStorage.getItem("ndahome_projects_v2");
    if (savedTx) {
      try {
        setTransactions(JSON.parse(savedTx));
      } catch {}
    }
    if (savedProj) {
      try {
        setProjects(JSON.parse(savedProj));
      } catch {}
    }
  }, []);

  // Lưu vào localStorage khi dữ liệu thay đổi
  useEffect(() => {
    localStorage.setItem(
      "ndahome_transactions_v2",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(
      "ndahome_projects_v2",
      JSON.stringify(projects)
    );
  }, [projects]);

  // =====================================================
  // 5. TÍNH TOÁN THU CHI & NGUỒN TIỀN
  // =====================================================

  const totalIn = transactions
    .filter((t) => t.type === "Thu")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOut = transactions
    .filter((t) => t.type === "Chi")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIn - totalOut;

  // Tính số dư Tiền mặt & Chuyển khoản
  const cashBalance =
    transactions
      .filter((t) => t.paymentMethod === "Tiền mặt" && t.type === "Thu")
      .reduce((s, t) => s + t.amount, 0) -
    transactions
      .filter((t) => t.paymentMethod === "Tiền mặt" && t.type === "Chi")
      .reduce((s, t) => s + t.amount, 0);

  const bankBalance =
    transactions
      .filter((t) => t.paymentMethod !== "Tiền mặt" && t.type === "Thu")
      .reduce((s, t) => s + t.amount, 0) -
    transactions
      .filter((t) => t.paymentMethod !== "Tiền mặt" && t.type === "Chi")
      .reduce((s, t) => s + t.amount, 0);

  // =====================================================
  // 6. TÌM KIẾM VÀ LỌC GIAO DỊCH
  // =====================================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchType =
        filter === "Tất cả" || t.type === filter;

      const matchProject =
        projectFilter === "Tất cả" ||
        (t.project || "Chung") === projectFilter;

      const matchMethod =
        methodFilter === "Tất cả" ||
        (t.paymentMethod || "Chuyển khoản") === methodFilter;

      const keyword = search.trim().toLowerCase();

      const matchText =
        t.name.toLowerCase().includes(keyword) ||
        t.category.toLowerCase().includes(keyword) ||
        (t.project || "").toLowerCase().includes(keyword) ||
        t.date.includes(keyword);

      return matchType && matchProject && matchMethod && matchText;
    });
  }, [transactions, filter, projectFilter, methodFilter, search]);

  // =====================================================
  // 7. THỐNG KÊ CHI PHÍ THEO DANH MỤC
  // =====================================================

  const expenseByCategory = useMemo(() => {
    const result: Record<string, number> = {};

    transactions
      .filter((t) => t.type === "Chi")
      .forEach((t) => {
        result[t.category] =
          (result[t.category] || 0) + t.amount;
      });

    return Object.entries(result).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  // =====================================================
  // 8. THỐNG KÊ THU CHI THEO THÁNG & THEO CÔNG TRÌNH
  // =====================================================

  const monthlyData = useMemo(() => {
    const months = ["06", "07", "08", "09", "10", "11"];

    return months.map((month) => {
      const monthTransactions = transactions.filter(
        (t) =>
          t.date.slice(0, 4) === "2026" &&
          t.date.slice(5, 7) === month
      );

      return {
        label: `T${Number(month)}`,

        income: monthTransactions
          .filter((t) => t.type === "Thu")
          .reduce((sum, t) => sum + t.amount, 0),

        expense: monthTransactions
          .filter((t) => t.type === "Chi")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });
  }, [transactions]);

  const projectChartData = useMemo(() => {
    return projects.map((p) => {
      const pTx = transactions.filter(
        (t) => t.project === p.name
      );
      return {
        label: p.name,
        income: pTx
          .filter((t) => t.type === "Thu")
          .reduce((sum, t) => sum + t.amount, 0),
        expense: pTx
          .filter((t) => t.type === "Chi")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });
  }, [projects, transactions]);

  // =====================================================
  // 9. THÊM & SỬA GIAO DỊCH
  // =====================================================

  function openAddModal() {
    setEditingId(null);
    setForm({
      name: "",
      category: "Doanh thu",
      project: projects[0]?.name || "Chung",
      paymentMethod: "Chuyển khoản",
      type: "Thu",
      amount: "",
      date: getToday(),
    });
    setShowModal(true);
  }

  function openEditModal(tx: Transaction) {
    setEditingId(tx.id);
    setForm({
      name: tx.name,
      category: tx.category,
      project: tx.project || "Chung",
      paymentMethod: tx.paymentMethod || "Chuyển khoản",
      type: tx.type,
      amount: String(tx.amount),
      date: tx.date,
    });
    setShowModal(true);
  }

  function saveTransaction() {
    if (
      !form.name.trim() ||
      !form.amount ||
      !Number.isFinite(Number(form.amount)) ||
      Number(form.amount) <= 0 ||
      !form.date
    ) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }

    if (editingId !== null) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name.trim(),
                category: form.category,
                project: form.project,
                paymentMethod: form.paymentMethod,
                type: form.type,
                amount: Number(form.amount),
                date: form.date,
              }
            : item
        )
      );
    } else {
      const newTransaction: Transaction = {
        id: Date.now(),
        name: form.name.trim(),
        category: form.category,
        project: form.project,
        paymentMethod: form.paymentMethod,
        type: form.type,
        amount: Number(form.amount),
        date: form.date,
      };

      setTransactions((prev) => [
        newTransaction,
        ...prev,
      ]);
    }

    setShowModal(false);
    setEditingId(null);
  }

  const addTransaction = saveTransaction;

  // =====================================================
  // 10. XÓA GIAO DỊCH & XUẤT EXCEL (CSV)
  // =====================================================

  function deleteTransaction(id: number) {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa giao dịch này?"
    );

    if (confirmed) {
      setTransactions((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }
  }

  function exportToExcel() {
    const headers = [
      "Ngày",
      "Nội dung",
      "Công trình",
      "Danh mục",
      "Nguồn tiền",
      "Loại",
      "Số tiền (VND)",
    ];
    const rows = filteredTransactions.map((t) => [
      t.date,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.project || "Chung"}"`,
      `"${t.category}"`,
      `"${t.paymentMethod || "Chuyển khoản"}"`,
      t.type,
      t.amount,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BaoCao_ThuChi_NDAHOME_${getToday()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function addNewProject() {
    if (
      !projectForm.name.trim() ||
      !projectForm.customer.trim() ||
      Number(projectForm.budget) <= 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin công trình!");
      return;
    }

    setProjects((prev) => [
      ...prev,
      {
        name: projectForm.name.trim(),
        customer: projectForm.customer.trim(),
        budget: Number(projectForm.budget),
        status: projectForm.status,
      },
    ]);

    setProjectForm({
      name: "",
      customer: "",
      budget: "",
      status: "Đang thi công",
    });
    setShowProjectModal(false);
  }

  // =====================================================
  // 11. THẺ TỔNG QUAN (CÓ PHÂN TÁCH TIỀN MẶT / NGÂN HÀNG)
  // =====================================================

  function SummaryCards() {
    return (
      <section className="summary-grid">
        <div className="summary-card income-card">
          <div className="summary-label">
            <span className="summary-icon">↙</span>
            TỔNG THU
          </div>

          <strong>{money(totalIn)}</strong>
          <small>
            {transactions.filter((t) => t.type === "Thu").length} khoản thu đã ghi nhận
          </small>
        </div>

        <div className="summary-card expense-card">
          <div className="summary-label">
            <span className="summary-icon">↗</span>
            TỔNG CHI
          </div>

          <strong>{money(totalOut)}</strong>
          <small>
            {transactions.filter((t) => t.type === "Chi").length} khoản chi đã ghi nhận
          </small>
        </div>

        <div className="summary-card balance-card">
          <div className="summary-label">
            <span className="summary-icon">◈</span>
            SỐ DƯ HIỆN TẠI
          </div>

          <strong>{money(balance)}</strong>
          <small>
            Tiền mặt: <b>{money(cashBalance)}</b> · NH: <b>{money(bankBalance)}</b>
          </small>
        </div>
      </section>
    );
  }

  // =====================================================
  // 12. GIỚI THIỆU TRANG
  // =====================================================

  function PageIntro({
    eyebrow,
    title,
    description,
    action,
  }: {
    eyebrow: string;
    title: string;
    description: string;
    action?: ReactNode;
  }) {
    return (
      <section className="page-intro">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="intro-description">
            {description}
          </p>
        </div>

        {action}
      </section>
    );
  }

  // =====================================================
  // 13. BẢNG GIAO DỊCH (CÓ NÚT IN PHIẾU, SỬA, XÓA)
  // =====================================================

  function TransactionTable({
    rows,
    actions = false,
  }: {
    rows: Transaction[];
    actions?: boolean;
  }) {
    return (
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>NGÀY</th>
              <th>NỘI DUNG</th>
              <th>CÔNG TRÌNH</th>
              <th>NGUỒN TIỀN</th>
              <th>LOẠI</th>
              <th>SỐ TIỀN</th>
              {actions && <th>THAO TÁC</th>}
            </tr>
          </thead>

          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td>{t.date}</td>

                <td className="strong-cell">
                  {t.name}
                  <div style={{ fontSize: "11px", color: "#787882", fontWeight: 400 }}>
                    {t.category}
                  </div>
                </td>

                <td>{t.project || "Chung"}</td>

                <td>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "#f4f4f6",
                      color: "#3f3f46",
                      fontWeight: 600,
                    }}
                  >
                    {t.paymentMethod || "Chuyển khoản"}
                  </span>
                </td>

                <td>
                  <span
                    className={`pill ${
                      t.type === "Thu"
                        ? "pill-income"
                        : "pill-expense"
                    }`}
                  >
                    {t.type}
                  </span>
                </td>

                <td
                  className={
                    t.type === "Thu"
                      ? "text-income"
                      : "text-expense"
                  }
                >
                  {t.type === "Thu" ? "+" : "−"}
                  {money(t.amount)}
                </td>

                {actions && (
                  <td style={{ display: "flex", gap: "6px" }}>
                    <button
                      style={{
                        border: 0,
                        background: "#e7f3ff",
                        color: "#1d63b8",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                      onClick={() => setReceiptTx(t)}
                      title="Xem & In phiếu thu/chi"
                    >
                      In phiếu
                    </button>
                    <button
                      style={{
                        border: 0,
                        background: "#fbf3db",
                        color: "#98751d",
                        padding: "7px 10px",
                        borderRadius: "8px",
                        fontFamily: "inherit",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontSize: "11px",
                      }}
                      onClick={() => openEditModal(t)}
                    >
                      Sửa
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => deleteTransaction(t.id)}
                    >
                      Xóa
                    </button>
                  </td>
                )}
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={actions ? 7 : 6}
                  className="empty-cell"
                >
                  Chưa có giao dịch phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  // =====================================================
  // 14. TRANG TỔNG QUAN
  // =====================================================

  function OverviewPage() {
    return (
      <>
        <PageIntro
          eyebrow="NDA HOME · FINANCE"
          title="Tổng quan tài chính ✦"
          description="Theo dõi và quản lý dòng tiền của doanh nghiệp."
          action={
            <button
              className="gold-button"
              onClick={openAddModal}
            >
              ＋ Thêm giao dịch
            </button>
          }
        />

        <SummaryCards />

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Phân tích thu chi theo tháng</h2>
              <p>Rê chuột vào từng cột để xem số tiền chi tiết</p>
            </div>

            <div className="chart-keys">
              <span>
                <i className="key-income" />
                Tiền thu
              </span>

              <span>
                <i className="key-expense" />
                Tiền chi
              </span>
            </div>
          </div>

          <BarChart data={monthlyData} />
        </section>

        <div className="two-column">
          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Cơ cấu chi phí</h2>
                <p>Tỷ trọng chi phí theo danh mục</p>
              </div>
            </div>

            <PieChart data={expenseByCategory} />
          </section>

          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Giao dịch gần đây</h2>
                <p>Các khoản thu chi mới nhất</p>
              </div>

              <button
                className="text-button"
                onClick={() =>
                  setActivePage("transactions")
                }
              >
                Xem tất cả →
              </button>
            </div>

            <div className="recent-list">
              {transactions.slice(0, 4).map((t) => (
                <div className="recent-row" key={t.id}>
                  <div>
                    <strong>{t.name}</strong>
                    <small>
                      {t.date} · {t.project || "Chung"} ·{" "}
                      {t.paymentMethod || "Chuyển khoản"}
                    </small>
                  </div>

                  <b
                    className={
                      t.type === "Thu"
                        ? "text-income"
                        : "text-expense"
                    }
                  >
                    {t.type === "Thu" ? "+" : "−"}
                    {money(t.amount)}
                  </b>
                </div>
              ))}

              {transactions.length === 0 && (
                <p className="muted">
                  Chưa có giao dịch nào.
                </p>
              )}
            </div>
          </section>
        </div>
      </>
    );
  }

   // =====================================================
  // 16. TRANG BÁO CÁO TÀI CHÍNH
  // =====================================================

  function ReportsPage() {
    // Thêm state chuyển đổi Ngày / Tháng ở đây
    const [timeframe, setTimeframe] = useState<'day' | 'month'>('month');

    return (
      <>
        <PageIntro
          eyebrow="NDA HOME · FINANCE"
          title="Báo cáo tài chính"
          description="Phân tích doanh thu, chi phí theo tháng và hiệu quả từng công trình."
          action={
            <button
              className="gold-button"
              onClick={exportToExcel}
            >
              ↓ Xuất báo cáo Excel
            </button>
          }
        />

        <SummaryCards />

        {/* Hàng 1: Hai biểu đồ cột */}
        <div className="two-column">
          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Biểu đồ cột thu chi {timeframe === 'month' ? 'theo tháng' : 'theo ngày'}</h2>
                <p>So sánh dòng tiền {timeframe === 'month' ? 'qua các tháng năm 2026' : '7 ngày gần nhất'}</p>
              </div>

              {/* Nhóm nút Toggle Ngày / Tháng và Chú thích */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'inline-flex', background: '#f3f4f6', padding: '2px', borderRadius: '8px' }}>
                  <button
                    onClick={() => setTimeframe('day')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      borderRadius: '6px',
                      border: 'none',
                      background: timeframe === 'day' ? '#111827' : 'transparent',
                      color: timeframe === 'day' ? '#facc15' : '#4b5563',
                      cursor: 'pointer'
                    }}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setTimeframe('month')}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 500,
                      borderRadius: '6px',
                      border: 'none',
                      background: timeframe === 'month' ? '#111827' : 'transparent',
                      color: timeframe === 'month' ? '#facc15' : '#4b5563',
                      cursor: 'pointer'
                    }}
                  >
                    Tháng
                  </button>
                </div>

                <div className="chart-keys">
                  <span>
                    <i className="key-income" /> Thu
                  </span>
                  <span>
                    <i className="key-expense" /> Chi
                  </span>
                </div>
              </div>
            </div>

            <BarChart data={timeframe === 'month' ? monthlyData : monthlyData} />
          </section>

          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Biểu đồ cột theo công trình</h2>
                <p>So sánh tổng thu và chi phí từng dự án</p>
              </div>

              <div className="chart-keys">
                <span>
                  <i className="key-income" /> Thu
                </span>
                <span>
                  <i className="key-expense" /> Chi
                </span>
              </div>
            </div>

            <BarChart data={projectChartData} />
          </section>
        </div>

        {/* Hàng 2: Gom 2 biểu đồ tròn vào chung khung .two-column để chia đôi màn hình cân đối */}
        <div className="two-column">
          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Biểu đồ tròn cơ cấu chi phí</h2>
                <p>Tỷ trọng từng danh mục trong tổng chi phí</p>
              </div>
            </div>
            <PieChart data={expenseByCategory} />
          </section>

          <section className="content-panel">
            <div className="panel-heading">
              <div>
                <h2>Biểu đồ tròn cơ cấu nguồn thu</h2>
                <p>Tỷ trọng các nguồn thu chính của doanh nghiệp</p>
              </div>
            </div>
            <PieChart data={expenseByCategory} />
          </section>
        </div>
      </>
    );
  }
  
  // =====================================================
  // 17. TRANG DANH MỤC THU CHI
  // =====================================================

  function CategoriesPage() {
    const rows = Array.from(
      new Set(transactions.map((t) => t.category))
    ).map((name) => {
      const items = transactions.filter(
        (t) => t.category === name
      );

      return {
        name,
        count: items.length,

        income: items
          .filter((t) => t.type === "Thu")
          .reduce((sum, t) => sum + t.amount, 0),

        expense: items
          .filter((t) => t.type === "Chi")
          .reduce((sum, t) => sum + t.amount, 0),
      };
    });

    return (
      <>
        <PageIntro
          eyebrow="NDA HOME · MANAGEMENT"
          title="Danh mục thu chi"
          description="Theo dõi các nhóm doanh thu và chi phí của doanh nghiệp."
        />

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Danh sách danh mục</h2>
              <p>
                Thống kê theo các giao dịch đã ghi nhận
              </p>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>TÊN DANH MỤC</th>
                  <th>SỐ GIAO DỊCH</th>
                  <th>TỔNG THU</th>
                  <th>TỔNG CHI</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr key={r.name}>
                    <td className="strong-cell">
                      {r.name}
                    </td>

                    <td>{r.count}</td>

                    <td className="text-income">
                      {money(r.income)}
                    </td>

                    <td className="text-expense">
                      {money(r.expense)}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty-cell">
                      Chưa có danh mục nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Biểu đồ cơ cấu chi phí</h2>
              <p>Phân bổ chi phí theo danh mục</p>
            </div>
          </div>

          <PieChart data={expenseByCategory} />
        </section>
      </>
    );
  }

  // =====================================================
  // 18. TRANG QUẢN LÝ CÔNG TRÌNH (CÓ THANH CẢNH BÁO NGÂN SÁCH)
  // =====================================================

  function ProjectsPage() {
    return (
      <>
        <PageIntro
          eyebrow="NDA HOME · MANAGEMENT"
          title="Quản lý công trình"
          description="Theo dõi tiến độ, cảnh báo ngân sách và lãi/lỗ từng công trình."
          action={
            <button
              className="gold-button"
              onClick={() => setShowProjectModal(true)}
            >
              ＋ Thêm công trình
            </button>
          }
        />

        <section className="summary-grid project-summary">
          <div>
            <small>TỔNG CÔNG TRÌNH</small>
            <strong>{projects.length}</strong>
          </div>

          <div>
            <small>ĐANG THI CÔNG</small>
            <strong>
              {
                projects.filter(
                  (p) => p.status === "Đang thi công"
                ).length
              }
            </strong>
          </div>

          <div>
            <small>ĐÃ HOÀN THÀNH</small>
            <strong>
              {
                projects.filter(
                  (p) => p.status === "Hoàn thành"
                ).length
              }
            </strong>
          </div>
        </section>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Biểu đồ thu chi theo công trình</h2>
              <p>So sánh dòng tiền thực tế của các công trình</p>
            </div>
            <div className="chart-keys">
              <span>
                <i className="key-income" />
                Tiền thu
              </span>
              <span>
                <i className="key-expense" />
                Tiền chi
              </span>
            </div>
          </div>
          <BarChart data={projectChartData} />
        </section>

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Danh sách công trình & Kiểm soát ngân sách</h2>
              <p>Tự động cảnh báo khi chi phí chạm ngưỡng ngân sách dự kiến</p>
            </div>
          </div>

          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>CÔNG TRÌNH</th>
                  <th>NGÂN SÁCH</th>
                  <th>THỰC THU</th>
                  <th>THỰC CHI</th>
                  <th>TIẾN ĐỘ CHI NGÂN SÁCH</th>
                  <th>LỢI NHUẬN</th>
                  <th>TRẠNG THÁI</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((p) => {
                  const pIn = transactions
                    .filter((t) => t.project === p.name && t.type === "Thu")
                    .reduce((s, t) => s + t.amount, 0);
                  const pOut = transactions
                    .filter((t) => t.project === p.name && t.type === "Chi")
                    .reduce((s, t) => s + t.amount, 0);
                  const profit = pIn - pOut;

                  // Tính % chi tiêu so với ngân sách
                  const percent =
                    p.budget > 0 ? Math.round((pOut / p.budget) * 100) : 0;
                  const barColor =
                    percent > 100
                      ? "#cf3f3f"
                      : percent >= 80
                      ? "#d97706"
                      : "#159b68";

                  return (
                    <tr key={p.name}>
                      <td className="strong-cell">
                        {p.name}
                        <div style={{ fontSize: "11px", color: "#787882", fontWeight: 400 }}>
                          {p.customer}
                        </div>
                      </td>

                      <td>{money(p.budget)}</td>

                      <td className="text-income">{money(pIn)}</td>

                      <td className="text-expense">{money(pOut)}</td>

                      <td style={{ minWidth: "155px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            fontSize: "11px",
                            fontWeight: 700,
                            color: barColor,
                            marginBottom: "4px",
                          }}
                        >
                          <span>{percent}% ngân sách</span>
                          <span>
                            {percent > 100
                              ? "Vượt mức!"
                              : percent >= 80
                              ? "Sắp chạm trần"
                              : "An toàn"}
                          </span>
                        </div>
                        <div
                          style={{
                            width: "100%",
                            height: "7px",
                            background: "#ececf0",
                            borderRadius: "99px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${Math.min(100, percent)}%`,
                              height: "100%",
                              background: barColor,
                              borderRadius: "99px",
                            }}
                          />
                        </div>
                      </td>

                      <td
                        className={
                          profit >= 0 ? "text-income" : "text-expense"
                        }
                        style={{ fontWeight: 700 }}
                      >
                        {money(profit)}
                      </td>

                      <td>
                        <span className="pill pill-income">
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {showProjectModal && (
          <div className="modal-backdrop">
            <div className="modal-box">
              <div className="modal-title">
                <h2>Thêm công trình mới</h2>
                <button
                  className="modal-close"
                  onClick={() => setShowProjectModal(false)}
                >
                  ×
                </button>
              </div>

              <label>Tên công trình</label>
              <input
                placeholder="Ví dụ: Công trình D - Biệt thự Quận 2"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, name: e.target.value })
                }
              />

              <label>Khách hàng</label>
              <input
                placeholder="Ví dụ: Khách hàng Phạm Văn D"
                value={projectForm.customer}
                onChange={(e) =>
                  setProjectForm({
                    ...projectForm,
                    customer: e.target.value,
                  })
                }
              />

              <label>Ngân sách dự kiến (VND)</label>
              <input
                type="number"
                placeholder="Ví dụ: 300000000"
                value={projectForm.budget}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, budget: e.target.value })
                }
              />

              <label>Trạng thái</label>
              <select
                value={projectForm.status}
                onChange={(e) =>
                  setProjectForm({ ...projectForm, status: e.target.value })
                }
              >
                <option value="Chuẩn bị">Chuẩn bị</option>
                <option value="Đang thi công">Đang thi công</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>

              <button
                className="gold-button modal-submit"
                onClick={addNewProject}
              >
                Lưu công trình
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // =====================================================
  // 19. TRANG CÀI ĐẶT
  // =====================================================

  function SettingsPage() {
    return (
      <>
        <PageIntro
          eyebrow="NDA HOME · SYSTEM"
          title="Cài đặt hệ thống"
          description="Thông tin cơ bản và quản lý dữ liệu lưu trữ của hệ thống."
        />

        <section className="content-panel settings-panel">
          <h2>Thông tin doanh nghiệp</h2>

          <label>
            Tên doanh nghiệp
            <input
              value={companyName}
              onChange={(e) =>
                setCompanyName(e.target.value)
              }
            />
          </label>

          <label>
            Người quản trị
            <input
              value={adminName}
              onChange={(e) =>
                setAdminName(e.target.value)
              }
            />
          </label>

          <label>
            Đơn vị tiền tệ
            <select defaultValue="VND">
              <option value="VND">
                Việt Nam đồng (VND)
              </option>
            </select>
          </label>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              className="gold-button"
              onClick={() =>
                alert("Đã cập nhật thông tin hệ thống!")
              }
            >
              Lưu cài đặt
            </button>

            <button
              className="delete-button"
              style={{ padding: "12px 18px", fontSize: "12.5px" }}
              onClick={() => {
                if (
                  window.confirm(
                    "Khôi phục lại toàn bộ dữ liệu mẫu ban đầu?"
                  )
                ) {
                  setTransactions(initialTransactions);
                  setProjects(initialProjects);
                  localStorage.removeItem("ndahome_transactions_v2");
                  localStorage.removeItem("ndahome_projects_v2");
                }
              }}
            >
              Khôi phục dữ liệu mẫu
            </button>
          </div>
        </section>

        <section className="content-panel">
          <h2>Thông tin phiên bản</h2>
          <p className="muted">
            NDA HOME Finance Management · Phiên bản 3.0 (Quản lý nguồn tiền, Cảnh báo ngân sách & In chứng từ)
          </p>
        </section>
      </>
    );
  }

  // =====================================================
  // 20. ĐIỀU HƯỚNG CÁC TRANG
  // =====================================================

  function renderPage() {
    switch (activePage) {
      case "overview":
        return <OverviewPage />;

      case "transactions":
        return <TransactionsPage />;

      case "reports":
        return <ReportsPage />;

      case "categories":
        return <CategoriesPage />;

      case "projects":
        return <ProjectsPage />;

      case "settings":
        return <SettingsPage />;

      default:
        return <OverviewPage />;
    }
  }

  // =====================================================
  // 21. GIAO DIỆN VÀ CSS
  // =====================================================

  return (
    <main className="app-shell">
     <style>{`
        * {
          box-sizing: border-box;
        }

        .app-shell {
          min-height: 100vh;
          display: flex;
          background: #f4f5f7;
          color: #18181b;
          font-variant-numeric: tabular-nums;
        }

        /* SIDEBAR */
        .sidebar {
          width: 260px;
          min-width: 260px;
          min-height: 100vh;
          background: linear-gradient(180deg, #141416 0%, #1e1d1a 100%);
          color: #fff;
          padding: 26px 18px 20px;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #2a2823;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 13px;
          margin: 0 4px 36px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .brand h2 {
          margin: 0 0 4px;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: 0.8px;
          color: #ffffff;
        }

        .brand span {
          display: block;
          color: #e2be4b;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .menu-label {
          margin: 0 10px 10px;
          color: #9e8a4c;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .menu {
          display: grid;
          gap: 6px;
          margin-bottom: 28px;
        }

        .sidebar .menu-item {
          appearance: none;
          display: flex;
          align-items: center;
          gap: 13px;
          width: 100%;
          padding: 13px 14px;
          border: 0;
          border-radius: 12px;
          background: transparent;
          color: #d4d1c9;
          font-family: inherit;
          font-size: 13.5px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar .menu-item span {
          width: 18px;
          color: #d9b63f;
          font-size: 16px;
          text-align: center;
          transition: transform 0.2s ease;
        }

        .sidebar .menu-item:hover {
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
          transform: translateX(3px);
        }

        .sidebar .menu-item.active {
          background: linear-gradient(110deg, #ecd068 0%, #c59b27 100%);
          color: #141416;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(201, 164, 59, 0.28);
        }

        .sidebar .menu-item.active span {
          color: #141416;
        }

        .sidebar-bottom {
          margin-top: auto;
        }

        .support-card {
          padding: 16px;
          border: 1px solid rgba(217, 182, 63, 0.25);
          border-radius: 14px;
          background: linear-gradient(145deg, rgba(48, 43, 29, 0.9), rgba(28, 26, 22, 0.95));
          margin-bottom: 18px;
        }

        .support-card b {
          color: #ecc953;
          font-size: 20px;
        }

        .support-card strong {
          display: block;
          margin: 10px 0 6px;
          font-size: 13px;
          font-weight: 700;
        }

        .support-card p {
          margin: 0;
          color: #b8b3a8;
          font-size: 11.5px;
          line-height: 1.55;
        }

        .profile {
          display: flex;
          align-items: center;
          gap: 11px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding: 16px 4px 0;
        }

        .avatar, .top-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #ebd067, #c29824);
          color: #171717;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 4px 10px rgba(201, 164, 59, 0.25);
        }

        .profile strong,
        .profile small {
          display: block;
        }

        .profile strong {
          font-size: 12.5px;
          font-weight: 600;
        }

        .profile small {
          color: #9c988f;
          font-size: 11px;
          margin-top: 3px;
        }

        /* MAIN AREA */
        .main-area {
          min-width: 0;
          flex: 1;
        }

        .topbar {
          height: 70px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e7e7e4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 38px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .breadcrumb {
          color: #8c8c8c;
          font-size: 12.5px;
        }

        .topbar strong {
          font-size: 12.5px;
          color: #18181b;
          font-weight: 600;
        }

        .top-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .system-status {
          display: flex;
          align-items: center;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 5px 12px;
          border-radius: 99px;
          color: #15803d;
          font-size: 11.5px;
          font-weight: 600;
        }

        .system-status i {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a34a;
          margin-right: 7px;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.2);
        }

        .main-content {
          max-width: 1560px;
          margin: auto;
          padding: 32px 38px 28px;
        }

        /* PAGE INTRO */
        .page-intro {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 26px;
        }

        .eyebrow {
          margin: 0 0 8px;
          color: #b38d2e;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
        }

        .page-intro h1 {
          margin: 0;
          font-size: clamp(23px, 2.2vw, 28px);
          font-weight: 800;
          letter-spacing: -0.5px;
          color: #141416;
        }

        .intro-description {
          color: #71717a;
          margin: 6px 0 0;
          font-size: 13.5px;
        }

        .gold-button {
          border: 0;
          border-radius: 12px;
          padding: 13px 22px;
          background: linear-gradient(110deg, #ebd067 0%, #c49a28 100%);
          color: #141416;
          font-family: inherit;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          box-shadow: 0 6px 18px rgba(196, 154, 40, 0.28);
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .gold-button:hover {
          filter: brightness(1.05);
          transform: translateY(-2px);
          box-shadow: 0 10px 22px rgba(196, 154, 40, 0.35);
        }

        /* SUMMARY CARDS */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: #ffffff;
          border: 1px solid #e8e8e5;
          border-top: 4px solid #c9a43b;
          border-radius: 16px;
          padding: 22px 24px;
          min-height: 142px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .summary-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.06);
        }

        .summary-card.expense-card {
          border-top-color: #e45a58;
        }

        .summary-card.balance-card {
          border-top-color: #159b68;
        }

        .summary-label {
          display: flex;
          align-items: center;
          gap: 11px;
          color: #52525b;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
        }

        .summary-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #fcf6e6;
          color: #b38d2e;
          font-size: 16px;
          font-weight: 700;
        }

        .expense-card .summary-icon {
          background: #fef2f2;
          color: #dc2626;
        }

        .balance-card .summary-icon {
          background: #ecfdf5;
          color: #059669;
        }

        .summary-card > strong {
          display: block;
          margin: 14px 0 6px;
          color: #b5891e;
          font-size: clamp(22px, 2.1vw, 28px);
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .expense-card > strong {
          color: #dc2626;
        }

        .balance-card > strong {
          color: #059669;
        }

        .summary-card small {
          color: #8c8c94;
          font-size: 12px;
        }

        /* CONTENT PANELS */
        .content-panel {
          background: #ffffff;
          border: 1px solid #e8e8e5;
          border-radius: 18px;
          padding: 24px 26px;
          margin-bottom: 22px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 22px;
        }

        .panel-heading h2,
        .content-panel > h2 {
          margin: 0;
          font-size: 16.5px;
          font-weight: 700;
          color: #18181b;
        }

        .panel-heading p {
          margin: 5px 0 0;
          color: #8c8c94;
          font-size: 12px;
        }

        /* BAR CHART */
        .chart-keys {
          display: flex;
          gap: 18px;
          color: #52525b;
          font-size: 11.5px;
          font-weight: 600;
        }

        .chart-keys span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .chart-keys i,
        .legend-dot {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 3px;
        }

        .key-income {
          background: #c9a43b;
        }

        .key-expense {
          background: #3f3f46;
        }

        .bar-chart-area {
          display: flex;
          height: 255px;
          padding-top: 10px;
        }

        .bar-axis {
          width: 38px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0 0 25px;
          color: #9ca3af;
          font-size: 10.5px;
          font-weight: 500;
        }

        .bar-chart {
          flex: 1;
          display: flex;
          align-items: stretch;
          justify-content: space-around;
          border-bottom: 1px solid #e5e7eb;
          background: repeating-linear-gradient(
            to bottom,
            transparent 0,
            transparent calc(25% - 1px),
            #f1f1ef calc(25% - 1px),
            #f1f1ef 25%
          );
        }

        .bar-month {
          width: 14%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          gap: 9px;
          color: #71717a;
          font-size: 11px;
          font-weight: 600;
        }

        .bar-pair {
          height: calc(100% - 25px);
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 8px;
        }

        .bar-column {
          width: min(26px, 40%);
          min-height: 4px;
          border-radius: 7px 7px 0 0;
          transition: height 0.35s ease, filter 0.2s ease, transform 0.2s ease;
          cursor: pointer;
        }

        .bar-column:hover {
          filter: brightness(1.08);
          transform: scaleY(1.02);
        }

        .income-column {
          background: linear-gradient(180deg, #ebd067 0%, #b88d25 100%);
          box-shadow: 0 4px 12px rgba(201, 164, 59, 0.22);
        }

        .expense-column {
          background: linear-gradient(180deg, #6b7280 0%, #27272a 100%);
        }

        /* TWO COLUMN */
        .two-column {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 22px;
        }

        .two-column .content-panel {
          min-width: 0;
        }

        /* PIE CHART */
        .pie-layout {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 26px;
          min-height: 210px;
        }

        .pie-chart {
          width: 180px;
          height: 180px;
          flex: 0 0 180px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
        }

        .pie-hole {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8px;
        }

        .pie-hole strong {
          font-size: 13px;
          font-weight: 800;
        }

        .pie-hole span {
          color: #8c8c94;
          font-size: 10px;
          margin-top: 4px;
        }

        .pie-legend {
          flex: 1;
          min-width: 120px;
          display: grid;
          gap: 12px;
        }

        .legend-row {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 12px;
        }

        .legend-row strong {
          margin-left: auto;
          font-weight: 700;
        }

        .legend-name {
          color: #52525b;
        }

        /* RECENT TRANSACTIONS */
        .recent-list {
          display: grid;
        }

        .recent-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 13px 6px;
          border-bottom: 1px solid #f1f1ef;
          border-radius: 8px;
          transition: background 0.15s ease;
        }

        .recent-row:hover {
          background: #fafaf9;
        }

        .recent-row:last-child {
          border-bottom: 0;
        }

        .recent-row strong,
        .recent-row small {
          display: block;
        }

        .recent-row strong {
          font-size: 12.5px;
          font-weight: 600;
          color: #18181b;
        }

        .recent-row small {
          color: #8c8c94;
          font-size: 11px;
          margin-top: 4px;
        }

        .recent-row b {
          font-size: 12.5px;
          font-weight: 700;
          white-space: nowrap;
        }

        .text-income {
          color: #059669 !important;
        }

        .text-expense {
          color: #dc2626 !important;
        }

        .text-button {
          border: 0;
          background: transparent;
          color: #a78327;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .text-button:hover {
          text-decoration: underline;
        }

        /* TABLE TOOLS */
        .table-tools {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 18px 0;
        }

        .filter-group {
          display: flex;
          gap: 8px;
        }

        .filter-button {
          border: 1px solid #e4e4e7;
          background: white;
          padding: 9px 16px;
          border-radius: 10px;
          color: #52525b;
          font-family: inherit;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .filter-button:hover {
          background: #f4f4f5;
        }

        .filter-button.selected {
          background: #fbf3db;
          color: #98751d;
          border-color: #e5cf86;
          font-weight: 700;
        }

        .search-input {
          width: min(290px, 100%);
          border: 1px solid #e4e4e7;
          border-radius: 10px;
          padding: 10px 14px;
          outline: none;
          font-family: inherit;
          font-size: 12.5px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .search-input:focus {
          border-color: #c9a43b;
          box-shadow: 0 0 0 3px rgba(201, 164, 59, 0.15);
        }

        /* TABLE */
        .table-scroll {
          width: 100%;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 620px;
          text-align: left;
        }

        .data-table th {
          background: #f8f8f7;
          color: #71717a;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.7px;
          padding: 14px;
          white-space: nowrap;
          border-bottom: 1px solid #e4e4e7;
        }

        .data-table td {
          border-bottom: 1px solid #f1f1ef;
          padding: 15px 14px;
          color: #52525b;
          font-size: 12.5px;
        }

        .data-table tbody tr:hover {
          background: #fafaf9;
        }

        .data-table tr:last-child td {
          border-bottom: 0;
        }

        .data-table .strong-cell {
          color: #18181b;
          font-weight: 600;
        }

        .pill {
          display: inline-block;
          border-radius: 99px;
          padding: 5px 11px;
          font-size: 10.5px;
          font-weight: 700;
        }

        .pill-income {
          background: #ecfdf5;
          color: #059669;
        }

        .pill-expense {
          background: #fef2f2;
          color: #dc2626;
        }

        .delete-button {
          border: 0;
          background: #fef2f2;
          color: #dc2626;
          padding: 7px 12px;
          border-radius: 8px;
          font-family: inherit;
          font-weight: 600;
          cursor: pointer;
          font-size: 11px;
          transition: background 0.15s ease;
        }

        .delete-button:hover {
          background: #fee2e2;
        }

        .empty-cell {
          text-align: center !important;
          color: #9ca3af !important;
          padding: 32px !important;
        }

        /* PROJECTS */
        .project-summary > div {
          background: white;
          border: 1px solid #e8e8e5;
          border-radius: 16px;
          padding: 22px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
        }

        .project-summary small,
        .project-summary strong {
          display: block;
        }

        .project-summary small {
          color: #71717a;
          font-size: 11px;
          font-weight: 700;
        }

        .project-summary strong {
          margin-top: 12px;
          font-size: 25px;
          font-weight: 800;
          color: #bd9226;
        }

        /* SETTINGS */
        .settings-panel label {
          display: block;
          color: #52525b;
          font-size: 12.5px;
          font-weight: 600;
          margin: 18px 0;
        }

        .settings-panel input,
        .settings-panel select {
          display: block;
          width: 100%;
          padding: 12px 14px;
          margin-top: 7px;
          border: 1px solid #e4e4e7;
          border-radius: 10px;
          font: inherit;
          font-size: 13px;
        }

        .muted {
          color: #8c8c94;
          font-size: 12px;
        }

        .footer {
          text-align: center;
          padding: 20px 0 6px;
          color: #9ca3af;
          font-size: 10.5px;
          letter-spacing: 1.2px;
        }

        /* MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 30;
          background: rgba(15, 15, 18, 0.55);
          backdrop-filter: blur(4px);
          display: grid;
          place-items: center;
          padding: 18px;
        }

        .modal-box {
          width: min(470px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 20px;
          padding: 26px;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
        }

        .modal-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .modal-title h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
        }

        .modal-close {
          border: 0;
          background: #f4f4f5;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 18px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .modal-close:hover {
          background: #e4e4e7;
        }

        .modal-box label {
          display: block;
          margin: 14px 0 7px;
          color: #3f3f46;
          font-size: 12px;
          font-weight: 600;
        }

        .modal-box input,
        .modal-box select {
          width: 100%;
          border: 1px solid #e4e4e7;
          border-radius: 10px;
          padding: 11px 13px;
          font: inherit;
          font-size: 13px;
        }

        .type-choice {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .type-choice button {
          padding: 12px;
          border: 1px solid #e4e4e7;
          border-radius: 10px;
          background: white;
          font-family: inherit;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .type-choice .chosen-income {
          background: #ecfdf5;
          border-color: #10b981;
          color: #059669;
          font-weight: 700;
        }

        .type-choice .chosen-expense {
          background: #fef2f2;
          border-color: #ef4444;
          color: #dc2626;
          font-weight: 700;
        }

        .modal-submit {
          width: 100%;
          margin-top: 22px;
        }

        /* RESPONSIVE */
        @media (max-width: 1000px) {
          .sidebar {
            width: 220px;
            min-width: 220px;
          }

          .main-content {
            padding: 26px 22px;
          }

          .two-column {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 700px) {
          .app-shell {
            display: block;
          }

          .sidebar {
            width: 100%;
            min-width: 0;
            min-height: auto;
            padding: 16px;
          }

          .brand {
            margin: 0 0 16px;
            padding-bottom: 14px;
          }

          .menu-label {
            margin-top: 10px;
          }

          .menu {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 10px;
          }

          .menu-item {
            width: auto !important;
            padding: 10px 12px;
            font-size: 12px;
          }

          .menu-item span {
            width: auto;
          }

          .sidebar-bottom {
            display: none;
          }

          .topbar {
            height: 58px;
            padding: 0 16px;
          }

          .main-content {
            padding: 22px 15px;
          }

          .page-intro {
            align-items: flex-start;
            flex-direction: column;
          }

          .summary-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .summary-card {
            min-height: auto;
          }

          .table-tools {
            align-items: stretch;
            flex-direction: column;
          }

          .search-input {
            width: 100%;
          }

          .pie-layout {
            flex-direction: column;
          }
        }
      `}</style>
      {/* =================================================
          SIDEBAR
      ================================================= */}

     <aside className="sidebar">
        <div className="brand">
          <img
            src="/ndahome.png"
            alt="NDA HOME Logo"
            style={{
              width: "51px",
              height: "51px",
              minWidth: "51px",
              objectFit: "contain",
              background: "transparent",
            }}
          />

          <div>
            <h2>{companyName}</h2>
            <span>FINANCE MANAGEMENT</span>
          </div>
        </div>

        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="menu-label">{group.label}</p>

            <nav className="menu">
              {group.items.map((item) => (
                <button
                  key={item.key}
                  className={`menu-item ${
                    activePage === item.key ? "active" : ""
                  }`}
                  onClick={() => {
                    setActivePage(item.key);
                    setFilter("Tất cả");
                    setSearch("");
                  }}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="support-card">
            <b>✦</b>
            <strong>{companyName}</strong>
            <p>
              Quản lý tài chính thông minh và hiệu quả.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{adminName}</strong>
              <small>Quản trị viên</small>
            </div>
          </div>
        </div>
      </aside>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="breadcrumb">
              NDA HOME /
            </span>

            <strong>{pageTitles[activePage]}</strong>
          </div>

          <div className="top-right">
            <span className="system-status">
              <i />
              Hệ thống demo
            </span>

            <div className="top-avatar">
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="main-content">
          {renderPage()}

          <footer className="footer">
            NDA HOME · CÔNG TY TNHH NDAHOME
          </footer>
        </div>
      </div>

     {/* =================================================
          MODAL THÊM / SỬA GIAO DỊCH
      ================================================= */}

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-title">
              <div>
                <p className="eyebrow">
                  NDA HOME FINANCE
                </p>

                <h2>
                  {editingId !== null
                    ? "Sửa giao dịch"
                    : "Thêm giao dịch mới"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <label>Loại giao dịch</label>

            <div className="type-choice">
              <button
                className={
                  form.type === "Thu"
                    ? "chosen-income"
                    : ""
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Thu",
                    category: "Doanh thu",
                  })
                }
              >
                ＋ Khoản thu
              </button>

              <button
                className={
                  form.type === "Chi"
                    ? "chosen-expense"
                    : ""
                }
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Chi",
                    category: "Vật tư",
                  })
                }
              >
                － Khoản chi
              </button>
            </div>

            <label>Nội dung giao dịch</label>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Ví dụ: Thanh toán hợp đồng..."
            />

            <label>Số tiền (VNĐ)</label>

            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={(e) =>
                setForm({
                  ...form,
                  amount: e.target.value,
                })
              }
              placeholder="Ví dụ: 5000000"
            />

            <label>Danh mục</label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
            >
              {form.type === "Thu" ? (
                <>
                  <option>Doanh thu</option>
                  <option>Đặt cọc</option>
                  <option>Khác</option>
                </>
              ) : (
                <>
                  <option>Vật tư</option>
                  <option>Nhân sự</option>
                  <option>Vận chuyển</option>
                  <option>Khác</option>
                </>
              )}
            </select>

            <label>Công trình</label>

            <select
              value={form.project}
              onChange={(e) =>
                setForm({
                  ...form,
                  project: e.target.value,
                })
              }
            >
              {projects.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
              <option value="Chung">Chi phí chung công ty</option>
            </select>

            <label>Nguồn tiền thanh toán</label>

            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMethod: e.target.value as
                    | "Tiền mặt"
                    | "Chuyển khoản",
                })
              }
            >
              <option value="Chuyển khoản">Chuyển khoản ngân hàng</option>
              <option value="Tiền mặt">Tiền mặt tại quỹ</option>
            </select>

            <label>Ngày giao dịch</label>

            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
            />

            <button
              className="gold-button modal-submit"
              onClick={addTransaction}
            >
              {editingId !== null
                ? "Cập nhật giao dịch →"
                : "Lưu giao dịch →"}
            </button>
          </div>
        </div>
      )}

      {/* =================================================
          MODAL IN PHIẾU THU / PHIẾU CHI
      ================================================= */}

    {receiptTx && (
        <div
          className="modal-backdrop"
          onClick={() => setReceiptTx(null)}
        >
          <div
            id="printable-receipt"
            className="modal-box"
            style={{ width: "min(560px, 100%)", padding: "32px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "2px solid #18181b",
                paddingBottom: "14px",
                marginBottom: "18px",
              }}
            >
              <div>
                <strong style={{ fontSize: "15px", letterSpacing: "0.06em" }}>
                  CÔNG TY TNHH {companyName}
                </strong>
                <div style={{ fontSize: "11px", color: "#666", marginTop: "3px" }}>
                  Bộ phận Tài chính – Kế toán
                </div>
              </div>
              <div style={{ textAlign: "right", fontSize: "11px" }}>
                <strong>Mã phiếu: #{String(receiptTx.id).slice(-5)}</strong>
                <div>Ngày: {receiptTx.date}</div>
              </div>
            </div>

            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "20px",
                  letterSpacing: "0.08em",
                  color: receiptTx.type === "Thu" ? "#159b68" : "#cf3f3f",
                }}
              >
                {receiptTx.type === "Thu" ? "PHIẾU THU TIỀN" : "PHIẾU CHI TIỀN"}
              </h2>
              <small style={{ color: "#787882" }}>
                (Chứng từ lưu hành nội bộ)
              </small>
            </div>

            <div
              style={{
                display: "grid",
                gap: "10px",
                fontSize: "13px",
                background: "#fafaf8",
                padding: "16px",
                borderRadius: "10px",
                border: "1px solid #ecece6",
              }}
            >
              <div>
                <b>Nội dung:</b> {receiptTx.name}
              </div>
              <div>
                <b>Công trình / Dự án:</b> {receiptTx.project || "Chung"}
              </div>
              <div>
                <b>Danh mục hạch toán:</b> {receiptTx.category}
              </div>
              <div>
                <b>Hình thức thanh toán:</b> {receiptTx.paymentMethod || "Chuyển khoản"}
              </div>
              <div style={{ fontSize: "15px", marginTop: "4px" }}>
                <b>Số tiền:</b>{" "}
                <span
                  style={{
                    fontWeight: 800,
                    color: receiptTx.type === "Thu" ? "#159b68" : "#cf3f3f",
                  }}
                >
                  {money(receiptTx.amount)}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                textAlign: "center",
                fontSize: "12px",
                marginTop: "24px",
                marginBottom: "38px",
              }}
            >
              <div>
                <strong>Giám đốc</strong>
                <div style={{ color: "#888", fontSize: "10.5px" }}>(Ký, họ tên)</div>
              </div>
              <div>
                <strong>Người lập phiếu</strong>
                <div style={{ color: "#888", fontSize: "10.5px" }}>({adminName})</div>
              </div>
              <div>
                <strong>
                  {receiptTx.type === "Thu" ? "Người nộp tiền" : "Người nhận tiền"}
                </strong>
                <div style={{ color: "#888", fontSize: "10.5px" }}>(Ký, họ tên)</div>
              </div>
            </div>

            <div
              className="no-print"
              style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}
            >
              <button
                className="filter-button"
                onClick={() => setReceiptTx(null)}
              >
                Đóng
              </button>
              <button
                className="gold-button"
                onClick={() => window.print()}
              >
                ↓ Xuất file PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );

 // =====================================================
  // TRANG QUẢN LÝ GIAO DỊCH 
  // =====================================================

  function TransactionsPage() {
    // 1. State quản lý lọc thời gian
    const [timeFilterType, setTimeFilterType] = useState<'all' | 'month' | 'day'>('all');
    const [selectedMonth, setSelectedMonth] = useState('2026-11'); 
    const [selectedDate, setSelectedDate] = useState('2026-11-15'); 

    // 2. Dùng trực tiếp mảng transactions (hoặc mảng dữ liệu gốc của bạn) để lọc an toàn tuyệt đối
    const currentTransactions = Array.isArray(transactions) ? transactions : [];

    const finalFilteredTransactions = currentTransactions.filter((item: any) => {
      // Lọc theo loại (Thu/Chi) nếu có
      if (filter && filter !== "Tất cả" && item.type !== filter) return false;
      // Lọc theo công trình nếu có
      if (projectFilter && projectFilter !== "Tất cả" && item.project !== projectFilter) return false;
      // Lọc theo nguồn tiền nếu có
      if (methodFilter && methodFilter !== "Tất cả" && item.method !== methodFilter) return false;
      // Lọc theo từ khóa tìm kiếm nếu có
    // Lọc theo từ khóa tìm kiếm nếu có
      if (search && !(item.content?.toLowerCase() || '').includes(search.toLowerCase()) && !(item.category?.toLowerCase() || '').includes(search.toLowerCase())) return false;

      // Lọc theo thời gian
      if (timeFilterType === 'month') {
        return item.date && item.date.startsWith(selectedMonth);
      }
      if (timeFilterType === 'day') {
        return item.date === selectedDate;
      }
      return true;
    });

    return (
      <>
        <PageIntro
          eyebrow="NDA HOME · FINANCE"
          title="Quản lý giao dịch"
          description="Theo dõi, in phiếu thu chi, chỉnh sửa và xuất báo cáo Excel."
          action={
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="filter-button"
                style={{ fontWeight: 700, padding: "12px 16px" }}
                onClick={exportToExcel}
              >
                ↓ Xuất Excel
              </button>
              <button
                className="gold-button"
                onClick={openAddModal}
              >
                ＋ Thêm giao dịch
              </button>
            </div>
          }
        />

        <SummaryCards />

        <section className="content-panel">
          <div className="panel-heading">
            <div>
              <h2>Danh sách giao dịch ({finalFilteredTransactions.length})</h2>
              <p>
                Lọc theo loại, công trình, nguồn tiền, ngày tháng hoặc in phiếu chứng từ
              </p>
            </div>
          </div>

          {/* Thanh công cụ lọc */}
          <div className="table-tools">
            <div className="filter-group" style={{ flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
              {["Tất cả", "Thu", "Chi"].map((v) => (
                <button
                  key={v}
                  className={
                    filter === v
                      ? "filter-button selected"
                      : "filter-button"
                  }
                  onClick={() => setFilter(v)}
                >
                  {v}
                </button>
              ))}

              <select
                className="filter-button"
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="Tất cả">Tất cả công trình</option>
                {projects && projects.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
                <option value="Chung">Chi phí chung</option>
              </select>

              <select
                className="filter-button"
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <option value="Tất cả">Tất cả nguồn tiền</option>
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
              </select>

              {/* Bộ lọc thời gian Ngày / Tháng */}
              <select
                className="filter-button"
                value={timeFilterType}
                onChange={(e) => setTimeFilterType(e.target.value as 'all' | 'month' | 'day')}
              >
                <option value="all">Tất cả thời gian</option>
                <option value="month">Lọc theo Tháng</option>
                <option value="day">Lọc theo Ngày cụ thể</option>
              </select>

              {timeFilterType === 'month' && (
                <input
                  type="month"
                  className="filter-button"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  style={{ background: '#fff', color: '#000', cursor: 'pointer' }}
                />
              )}

              {timeFilterType === 'day' && (
                <input
                  type="date"
                  className="filter-button"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ background: '#fff', color: '#000', cursor: 'pointer' }}
                />
              )}
            </div>

            <input
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="⌕ Tìm nội dung, danh mục..."
            />
          </div>

          <TransactionTable
            rows={finalFilteredTransactions}
            actions={true}
          />
        </section>
      </>
    );
  }
}
