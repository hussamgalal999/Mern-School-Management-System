import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar'; // Import the Sidebar component
import axios from 'axios'; // Import Axios for HTTP requests

const AttendanceContainer = styled.div`
  display: flex;
  padding-left: 240px;
`;

const Content = styled.div`
  flex: 1;
`;

const AttendanceContent = styled.div`
  padding: 20px;
`;

const AttendanceHeader = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const AttendanceList = styled.ul`
  list-style: none;
  padding: 0;
`;

const AttendanceItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const StudentName = styled.span`
  flex: 1;
`;

const CheckboxLabel = styled.label`
  margin-right: 10px;
`;

const Divider = styled.hr`
  margin-top: 5px;
  border: 0;
  border-top: 1px solid #ccc;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/students/getall');
      setStudents(response.data.students);
      initializeAttendanceData(response.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const initializeAttendanceData = (students) => {
    const initialAttendanceData = students.map((student) => ({
      id: student.id,
      name: student.name,
      status: 'Present', // Default to 'Present'
    }));
    setAttendanceData(initialAttendanceData);
  };

  const handleStatusChange = (id, event) => {
    const updatedData = attendanceData.map((student) => {
      if (student.id === id) {
        return { ...student, status: event.target.checked ? 'Present' : 'Absent' };
      }
      return student;
    });
    setAttendanceData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      // Send attendance data to the database
      const response = await axios.post('http://localhost:4000/api/v1/attendance', attendanceData);
      console.log('Attendance data submitted:', response.data);
    } catch (error) {
      console.error('Error submitting attendance data:', error);
    }
  };

  return (
    <AttendanceContainer>
      <Sidebar /> {/* Include the Sidebar component */}
      <Content>
        <AttendanceContent>
          <AttendanceHeader>Attendance</AttendanceHeader>
          <AttendanceList>
            {attendanceData.map((student, index) => (
              <React.Fragment key={student.id}>
                <AttendanceItem>
                  <StudentName>{student.name}</StudentName>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={student.status === 'Present'}
                      onChange={(event) => handleStatusChange(student.id, event)}
                    />
                    Present
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={student.status === 'Absent'}
                      onChange={(event) => handleStatusChange(student.id, event)}
                    />
                    Absent
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input
                      type="checkbox"
                      checked={student.status === 'Absent with apology'}
                      onChange={(event) => handleStatusChange(student.id, event)}
                    />
                    Absent with apology
                  </CheckboxLabel>
                </AttendanceItem>
                {index !== students.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </AttendanceList>
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        </AttendanceContent>
      </Content>
    </AttendanceContainer>
  );
};

export default Attendance;
