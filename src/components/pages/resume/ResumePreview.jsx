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
          src={formData?.personalInfo?.portfolio}
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
          {formData.personalInfo?.linkedIn && (
            <>
              <Text style={{ marginHorizontal: 5 }}>|</Text>
              <Link src={formData.personalInfo?.linkedIn}>LinkedIn</Link>
            </>
          )}
          {formData.personalInfo?.gitHub && (
            <>
              <Text style={{ marginHorizontal: 5 }}>|</Text>
              <Link src={formData.personalInfo?.gitHub}>GitHub</Link>
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
            <View key={index} style={{ marginTop: 5 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>
                  {educ.collegeName}{' '}
                  {educ.gpaScore && <Text>(GPA: {educ.gpaScore} / 4.0)</Text>}
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
                  {educ.startDate} - {educ.endDate}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {Object.keys(formData.education[0]).length > 0 && (
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
      linkedIn: PropTypes.string,
      gitHub: PropTypes.string,
      portfolio: PropTypes.string,
    }),
    education: PropTypes.arrayOf(
      PropTypes.shape({
        degree: PropTypes.string,
        collegeName: PropTypes.string,
        location: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        gpaScore: PropTypes.string,
      }),
    ),
    technicalSkills: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default ResumePreview;
