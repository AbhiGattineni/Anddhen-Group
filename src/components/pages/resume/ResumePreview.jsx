import React from 'react';
import { Document, Page, Text, View, Link } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

const ResumePreview = ({ formData }) => (
  <Document>
    <Page
      size="A4"
      style={{
        padding: 15,
        fontSize: 10,
        fontFamily: 'Helvetica',
      }}
    >
      {/* Personal Info */}
      <View style={{ marginBottom: 10, textAlign: 'center' }}>
        <Link
          src={formData?.personalInfo?.portfolio_Link}
          style={{
            fontSize: 16,
            fontWeight: 200,
            textDecoration: 'none',
            color: 'blue',
          }}
        >
          {formData.personalInfo?.name}
        </Link>
        <View
          style={{
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 5,
            fontSize: 11,
          }}
        >
          <Text>{formData.personalInfo?.address}</Text>
          {formData.personalInfo?.phone && (
            <>
              <Text style={{ marginHorizontal: 5 }}>|</Text>
              <Text>{formData.personalInfo?.phone}</Text>
            </>
          )}
          {formData.personalInfo?.email && (
            <>
              <Text style={{ marginHorizontal: 5 }}>|</Text>
              <Text>{formData.personalInfo?.email}</Text>
            </>
          )}
          {formData.personalInfo?.linkedIn_Link && (
            <>
              <Text style={{ marginHorizontal: 5 }}>|</Text>
              <Link src={formData.personalInfo?.linkedIn_Link}>LinkedIn</Link>
            </>
          )}
          {formData.personalInfo?.gitHub_Link && (
            <>
              <Text style={{ marginHorizontal: 5 }}>|</Text>
              <Link src={formData.personalInfo?.gitHub_Link}>GitHub</Link>
            </>
          )}
        </View>
      </View>

      {/* Education */}
      {Object.keys(formData.education[0]).length > 0 && (
        <View style={{ marginBottom: 2 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: 'bold',
              textDecoration: 'underline',
            }}
          >
            EDUCATION
          </Text>
          {formData.education?.map((educ, index) => (
            <View key={index} style={{ marginTop: 5, fontSize: 9 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {educ.college_Name}{' '}
                  {educ.gpa_Score && <Text>(GPA: {educ.gpa_Score} / 4.0)</Text>}
                </Text>
                <Text>{educ.location}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text>
                  {educ.degree} - {educ.field}
                </Text>
                <Text>
                  {educ.start_Date} - {educ.end_Date}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {Object.keys(formData.skills).length > 0 && (
        <>
          <View
            style={{
              height: 0.5,
              backgroundColor: '#000',
              marginVertical: 2,
            }}
          />

          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              TECHNICAL SKILLS
            </Text>
            {formData.technicalSkills?.map((skill, index) => (
              <Text key={index}>{skill}</Text>
            ))}
          </View>
        </>
      )}

      {/* Experience */}
      {Object.keys(formData.experience[0]).length > 0 && (
        <>
          <View
            style={{
              height: 0.5,
              backgroundColor: '#000',
              marginVertical: 2,
            }}
          />
          <View style={{ marginBottom: 2 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: 'bold',
                textDecoration: 'underline',
              }}
            >
              EXPERIENCE
            </Text>
          </View>
        </>
      )}
    </Page>
  </Document>
);

ResumePreview.propTypes = {
  formData: PropTypes.shape({
    personalInfo: PropTypes.shape({
      name: PropTypes.string,
      address: PropTypes.string,
      phone: PropTypes.string,
      email: PropTypes.string,
      linkedIn_Link: PropTypes.string,
      gitHub_Link: PropTypes.string,
      portfolio_Link: PropTypes.string,
    }),
    education: PropTypes.arrayOf(
      PropTypes.shape({
        degree: PropTypes.string,
        college_Name: PropTypes.string,
        location: PropTypes.string,
        start_Date: PropTypes.string,
        end_Date: PropTypes.string,
        gpa_Score: PropTypes.string,
      }),
    ),
    skills: PropTypes.arrayOf(PropTypes.string),
    technicalSkills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ResumePreview;
