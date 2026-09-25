import {
  EmployeeItem,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeStats,
  EmployeeStatus,
  EmployeeDepartment,
} from "@/types/employee";

const STORAGE_KEY = "nleta_employees_data";

const initialEmployees: EmployeeItem[] = [
  {
    id: "EMP-001",
    employeeCode: "NLETA-EMP-101",
    fullName: "Rajesh Kumar Sharma",
    email: "r.sharma@nletacrm.com",
    phone: "+91 98112 34567",
    department: "Safety & Compliance",
    designation: "Chief Technical Safety Auditor",
    employmentType: "Full-Time Permanent",
    workLocation: "Headquarters (New Delhi)",
    status: "Active",
    joiningDate: "2021-03-15",
    salaryBand: "Grade A (Executive)",
    safetyCertifications: ["ISO 9001 Lead Auditor", "BIS Escalator Inspector", "QCI Master Cert"],
    emergencyContact: "+91 98112 34500 (Spouse)",
    assignedProjectsCount: 18,
    notes: "Head of Northern Region Lift Audit Committee. Over 15 years experience.",
  },
  {
    id: "EMP-002",
    employeeCode: "NLETA-EMP-102",
    fullName: "Priyanka Nair",
    email: "p.nair@nletacrm.com",
    phone: "+91 98230 45678",
    department: "Field Engineering",
    designation: "Senior Field Inspection Engineer",
    employmentType: "Full-Time Permanent",
    workLocation: "Bengaluru Tech Hub",
    status: "On Field Duty",
    joiningDate: "2022-06-10",
    salaryBand: "Grade B (Senior Engineer)",
    safetyCertifications: ["EN 81-20/50 Specialist", "Hydraulic Lift Master"],
    emergencyContact: "+91 98230 45600 (Brother)",
    assignedProjectsCount: 14,
    notes: "Specializes in high-speed tech park passenger elevators and freight systems.",
  },
  {
    id: "EMP-003",
    employeeCode: "NLETA-EMP-103",
    fullName: "Amitabh Sen",
    email: "a.sen@nletacrm.com",
    phone: "+91 98311 56789",
    department: "Business Development",
    designation: "Enterprise Accounts Director",
    employmentType: "Full-Time Permanent",
    workLocation: "Kolkata Hub",
    status: "Active",
    joiningDate: "2020-01-20",
    salaryBand: "Grade A (Executive)",
    safetyCertifications: ["Corporate Risk Assessment"],
    emergencyContact: "+91 98311 56700 (Father)",
    assignedProjectsCount: 22,
    notes: "Handles metro rail transit audits and government infrastructure accounts.",
  },
  {
    id: "EMP-004",
    employeeCode: "NLETA-EMP-104",
    fullName: "Kavita Deshmukh",
    email: "k.deshmukh@nletacrm.com",
    phone: "+91 98450 67890",
    department: "Quality Assurance",
    designation: "Senior QA & Testing Officer",
    employmentType: "Full-Time Permanent",
    workLocation: "Mumbai Regional Office",
    status: "Active",
    joiningDate: "2023-02-01",
    salaryBand: "Grade B (Senior Officer)",
    safetyCertifications: ["ISO 17020 Inspection Body", "Six Sigma Green Belt"],
    emergencyContact: "+91 98450 67800 (Husband)",
    assignedProjectsCount: 9,
    notes: "Manages quality verification before certification issuance.",
  },
  {
    id: "EMP-005",
    employeeCode: "NLETA-EMP-105",
    fullName: "Arjun Reddy",
    email: "a.reddy@nletacrm.com",
    phone: "+91 98660 78901",
    department: "Field Engineering",
    designation: "Lead Escalator Specialist",
    employmentType: "Full-Time Permanent",
    workLocation: "Hyderabad Operations",
    status: "On Field Duty",
    joiningDate: "2022-11-15",
    salaryBand: "Grade B (Senior Engineer)",
    safetyCertifications: ["Heavy Duty Escalator Master", "Emergency Braking Systems"],
    emergencyContact: "+91 98660 78900 (Father)",
    assignedProjectsCount: 16,
    notes: "Directs airport terminal and metro station escalator safety commissioning.",
  },
  {
    id: "EMP-006",
    employeeCode: "NLETA-EMP-106",
    fullName: "Sneha Mukherjee",
    email: "s.mukherjee@nletacrm.com",
    phone: "+91 98711 89012",
    department: "Operations & Logistics",
    designation: "Logistics & Dispatch Manager",
    employmentType: "Full-Time Permanent",
    workLocation: "Headquarters (New Delhi)",
    status: "On Leave",
    joiningDate: "2021-08-18",
    salaryBand: "Grade C (Manager)",
    safetyCertifications: ["Fleet & Equipment Safety"],
    emergencyContact: "+91 98711 89000 (Mother)",
    assignedProjectsCount: 6,
    notes: "Coordinates testing equipment dispatch and technician scheduling.",
  },
  {
    id: "EMP-007",
    employeeCode: "NLETA-EMP-107",
    fullName: "Vikram Rathore",
    email: "v.rathore@nletacrm.com",
    phone: "+91 98901 90123",
    department: "Safety & Compliance",
    designation: "Modernization Audit Inspector",
    employmentType: "Contract Inspector",
    workLocation: "Chennai Branch",
    status: "Active",
    joiningDate: "2023-09-01",
    salaryBand: "Grade B (Contractor)",
    safetyCertifications: ["Modernization Safety Protocol", "Controller Retrofit Inspection"],
    emergencyContact: "+91 98901 90100 (Brother)",
    assignedProjectsCount: 11,
    notes: "Contract inspector for hospital elevator modernization projects.",
  },
  {
    id: "EMP-008",
    employeeCode: "NLETA-EMP-108",
    fullName: "Ananya Iyer",
    email: "a.iyer@nletacrm.com",
    phone: "+91 98222 01234",
    department: "Business Development",
    designation: "Key Account Manager - Hospitality",
    employmentType: "Probationary",
    workLocation: "Mumbai Regional Office",
    status: "Probation",
    joiningDate: "2026-07-01",
    salaryBand: "Grade C (Associate)",
    safetyCertifications: ["B2B Compliance Orientation"],
    emergencyContact: "+91 98222 01200 (Father)",
    assignedProjectsCount: 5,
    notes: "Handling hotel chains and commercial retail malls in Mumbai & Pune.",
  },
];

type Listener = () => void;

class EmployeeService {
  private listeners: Listener[] = [];

  private getStoredEmployees(): EmployeeItem[] {
    if (typeof window === "undefined") {
      return initialEmployees;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmployees));
        return initialEmployees;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse stored employees:", e);
      return initialEmployees;
    }
  }

  private saveStoredEmployees(employees: EmployeeItem[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
      this.notify();
    } catch (e) {
      console.error("Failed to save employees to localStorage:", e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error("EmployeeService notification error:", e);
      }
    });
  }

  public async getAllEmployees(): Promise<EmployeeItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.getStoredEmployees());
      }, 50);
    });
  }

  public async getEmployeeById(id: string): Promise<EmployeeItem | null> {
    const employees = this.getStoredEmployees();
    const found = employees.find((emp) => emp.id === id);
    return found || null;
  }

  public async createEmployee(input: CreateEmployeeInput): Promise<EmployeeItem> {
    const employees = this.getStoredEmployees();
    const nextNum = employees.length + 1;
    const newId = `EMP-${String(nextNum).padStart(3, "0")}`;
    const newCode = input.employeeCode?.trim() || `NLETA-EMP-${100 + nextNum}`;

    const newEmployee: EmployeeItem = {
      ...input,
      id: newId,
      employeeCode: newCode,
      assignedProjectsCount: input.assignedProjectsCount || 0,
      safetyCertifications: input.safetyCertifications || [],
    };

    const updated = [newEmployee, ...employees];
    this.saveStoredEmployees(updated);
    return newEmployee;
  }

  public async updateEmployee(
    id: string,
    input: UpdateEmployeeInput
  ): Promise<EmployeeItem | null> {
    const employees = this.getStoredEmployees();
    const index = employees.findIndex((emp) => emp.id === id);
    if (index === -1) return null;

    const updatedEmployee: EmployeeItem = {
      ...employees[index],
      ...input,
    };

    employees[index] = updatedEmployee;
    this.saveStoredEmployees([...employees]);
    return updatedEmployee;
  }

  public async deleteEmployee(id: string): Promise<boolean> {
    const employees = this.getStoredEmployees();
    const filtered = employees.filter((emp) => emp.id !== id);
    if (filtered.length === employees.length) return false;

    this.saveStoredEmployees(filtered);
    return true;
  }

  public async getEmployeeStats(): Promise<EmployeeStats> {
    const employees = this.getStoredEmployees();
    const totalEmployees = employees.length;
    const activeStaff = employees.filter((e) => e.status === "Active").length;
    const onFieldDuty = employees.filter((e) => e.status === "On Field Duty").length;
    const onLeave = employees.filter((e) => e.status === "On Leave").length;

    const statusBreakdown: Record<EmployeeStatus, number> = {
      Active: 0,
      "On Field Duty": 0,
      "On Leave": 0,
      Probation: 0,
      Inactive: 0,
    };

    const departmentBreakdown: Record<EmployeeDepartment, number> = {
      "Safety & Compliance": 0,
      "Field Engineering": 0,
      "Business Development": 0,
      "Quality Assurance": 0,
      "Operations & Logistics": 0,
      "Executive Management": 0,
    };

    employees.forEach((emp) => {
      if (statusBreakdown[emp.status] !== undefined) {
        statusBreakdown[emp.status]++;
      }
      if (departmentBreakdown[emp.department] !== undefined) {
        departmentBreakdown[emp.department]++;
      }
    });

    const uniqueDepts = new Set(employees.map((e) => e.department)).size;

    return {
      totalEmployees,
      activeStaff,
      onFieldDuty,
      onLeave,
      departmentsCount: uniqueDepts,
      statusBreakdown,
      departmentBreakdown,
    };
  }
}

export const employeeService = new EmployeeService();
