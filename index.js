/* eslint no-restricted-syntax: [off, ForOfStatement] */
/* eslint no-console: [off] */

const isValidString = (value) => typeof (value) === 'string' && value.length !== 0;

const isValidEmployeeData = (values) => values.every((value) => isValidString(value));

const employeeDB = {
  fields: ['name', 'position', 'department'],
  employees: [],

  // PART 1
  addEmployee(...fields) {
    if (isValidEmployeeData(fields)) {
      const [name, position, department] = fields;
      const employee = { name, position, department };
      if (this.findEmployeeIndex(name, position, department) === -1) {
        this.employees.push(employee);
        return true;
      }
    }
    return false;
  },

  select(...fields) {
    return this.employees.map((employee) => fields.map((field) => employee?.[field]));
  },

  printEmployees() {
    const getMaxStringLength = (strings) => strings.reduce((maxLength, string) => {
      if (maxLength < string.length) {
        return string.length;
      }
      return maxLength;
    }, 0);

    const fieldsWidths = Object.fromEntries(this.fields.map(
      (field) => [field, getMaxStringLength(this.select(field).flat())],
    ));

    const formatRow = (employee) => {
      const padValue = (value, fieldName) => `${value.padStart(fieldsWidths[fieldName])}`;

      return Object.entries(employee).map(([key, value]) => padValue(value, key)).join(' ');
    };

    // header
    console.log(formatRow(Object.fromEntries(this.fields.map(
      (field) => [field, field.toUpperCase()],
    ))));
    // content
    for (const employee of this.employees) {
      console.log(formatRow(employee));
    }
  },

  // PART 2
  namesToUpperCase() {
    Object.groupBy(
      this.employees,
      (employee) => employee.name = employee.name.toUpperCase(),
    );
  },

  departmentsToLowerCase() {
    Object.groupBy(
      this.employees,
      (employee) => employee.department = employee.department.toLowerCase(),
    );
  },

  queryIndexes(name, position, department) {
    const queryObj = { name, position, department };
    const indexes = Object.groupBy(this.employees, (employee, index) => this.fields.every(
      (field) => employee[field].startsWith(queryObj[field]),
    ) && index);
    return Object.keys(indexes).map(
      (index) => Number.parseInt(index),
    ).filter((index) => !Number.isNaN(index));
  },

  findEmployeeIndex(name, position, department) {
    const [index = -1, ...rest] = this.queryIndexes(name, position, department);
    if (rest.length === 0) {
      return index;
    }
    return -1;
  },

  deleteEmployee(name, position, department) {
    const index = this.findEmployeeIndex(name, position, department);
    if (index !== -1) {
      // delete this.employee[index]
      this.employees.splice(index, 1);
      return true;
    }
    return false;
  },

  updateEmployee(employee, data) {
    const index = this.findEmployeeIndex(
      employee.name,
      employee.position,
      employee.department,
    );
    if (index !== -1) {
      if (isValidEmployeeData(Object.values(data))) {
        this.employees[index] = { ...this.employees[index], ...data };
        return true;
      }
    }
    return false;
  },

  // PART 3
  clone() {
    // return structuredClone(this);
    return { ...this };
  },

  merge(employeeDBmerge) {
    return { ...this.clone(), ...employeeDBmerge };
  },

  getDepartments() {
    const departments = this.select('department').flat();
    return departments.filter((department, i) => departments.indexOf(department) === i);
  },

};

// PART 4
const compareEmployees = (employee1, employee2, fields) => fields.every(
  (field) => employee1?.[field] === employee2?.[field],
);

// TESTS
const getRandInt = (max) => Math.floor(Math.random() * max);

const genName = () => {
  const names = ['Ivan', 'Maxim', 'Petr', 'Semen'];
  const i = getRandInt(names.length);
  const j = getRandInt(names.length);
  return `${names[i]} ${names[j]}ov`;
};

const genPosition = () => {
  const positions = [
    'Senior accontant', 'Middle service manager', 'Junior sales manager',
  ];
  return positions[getRandInt(positions.length)];
};

const genDepartment = () => {
  const departments = [
    'Accounts department', 'Service department', 'Sales department',
  ];
  return departments[getRandInt(departments.length)];
};

const genEmployee = () => [genName(), genPosition(), genDepartment()];

const n = 10;
let employeesTestData = [];
employeesTestData.length = n;
employeesTestData.fill(null);
employeesTestData = employeesTestData.map(() => genEmployee());

const testPart1 = () => {
  console.log('PART1');
  for (const employee of employeesTestData) {
    employeeDB.addEmployee(...employee);
  }
  employeeDB.printEmployees();
};

const testPart2 = () => {
  console.log('PART2');
  employeeDB.namesToUpperCase();
  employeeDB.departmentsToLowerCase();

  const [name, position, department] = ['John', 'Project manager', 'Project department'];
  employeeDB.addEmployee(name, position, department);
  employeeDB.deleteEmployee(name, position, department);
  employeeDB.addEmployee(name, position, department);
  employeeDB.updateEmployee({ name, position, department }, { department: 'Servece department' });
  employeeDB.printEmployees();
};

const testPart3 = () => {
  console.log('PART3');
  const clonedEmployeeDB = employeeDB.clone();
  employeeDB.employees = [];
  const clonedLength = clonedEmployeeDB.employees.length;
  console.log('true:', clonedLength !== employeeDB.employees.length);
  employeeDB.addEmployee(...genEmployee());
  employeeDB.addEmployee(...genEmployee());
  employeeDB.addEmployee(...genEmployee());
  console.log('true:', clonedLength === clonedEmployeeDB.employees.length);
  const mergedEmployeeDB = employeeDB.merge(clonedEmployeeDB);
  mergedEmployeeDB.printEmployees();
  const departments = employeeDB.getDepartments();
  console.log(...departments);
};

const testPart4 = () => {
  console.log('PART4');
  const [name, position, department] = ['John', 'Project manager', 'Project department'];
  let result = compareEmployees({ name, position, department }, { name, position, department }, ['name', 'department']);
  console.log('true: ', result);
  result = compareEmployees({ name: 'Ivan', position, department }, { name, position, department }, ['name', 'department']);
  console.log('false: ', result);
};

testPart1();
testPart2();
testPart3();
testPart4();
