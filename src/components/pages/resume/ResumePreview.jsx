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
            fontFamily: 'Helvetica-Bold',
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
              <Link src={formData.personalInfo?.email}>
                {formData.personalInfo?.email}
              </Link>
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
      {Object.keys(formData?.education[0]).length > 0 && (
        <View style={{ marginBottom: 2 }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: 'Helvetica-Bold',
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
                <Text>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                    {educ.college_Name}
                  </Text>{' '}
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

      {Object.keys(formData?.skills).length > 0 && (
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
                fontFamily: 'Helvetica-Bold',
                textDecoration: 'underline',
              }}
            >
              TECHNICAL SKILLS
            </Text>
            {formData.categorialSkills &&
              Object.entries(formData.categorialSkills).map(
                ([category, skills], index) => (
                  <Text key={index} style={{ fontSize: 9 }}>
                    <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                      {category}:
                    </Text>{' '}
                    {skills.join(', ')}
                  </Text>
                ),
              )}
          </View>
        </>
      )}

      {/* Experience */}
      {Object.keys(formData?.experience[0]).length > 0 && (
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
                fontFamily: 'Helvetica-Bold',
                textDecoration: 'underline',
              }}
            >
              EXPERIENCE
            </Text>
            {formData.experience?.map((exp, index) => (
              <View key={index} style={{ marginTop: 5, fontSize: 9 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                    {exp.company_Name}
                  </Text>
                  <Text style={{ fontStyle: 'italic' }}>{exp.location}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    fontStyle: 'italic',
                  }}
                >
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                    {exp.role}
                  </Text>
                  <Text>
                    {exp.start_Date} - {exp.end_Date}
                  </Text>
                </View>
                {exp.description && (
                  <View style={{ marginLeft: 4 }}>
                    {exp.description.split('\n').map((desc, index) => (
                      <View key={index} style={{ flexDirection: 'row' }}>
                        <Text style={{ marginRight: 5 }}>•</Text>
                        <Text>{desc}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {Object.keys(formData?.projects[0]).length > 0 && (
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
                fontFamily: 'Helvetica-Bold',
                textDecoration: 'underline',
              }}
            >
              PROJECTS
            </Text>
            {formData.projects?.map((proj, index) => (
              <View key={index} style={{ marginTop: 5, fontSize: 9 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'left',
                  }}
                >
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                    {proj.title}
                  </Text>
                  <View style={{ width: 5 }} />
                  {proj?.project_Link && (
                    <Link src={proj.project_Link}>Link</Link>
                  )}
                </View>

                {proj.description && (
                  <View style={{ marginLeft: 4 }}>
                    {proj.description.split('\n').map((desc, index) => (
                      <View key={index} style={{ flexDirection: 'row' }}>
                        <Text style={{ marginRight: 5 }}>•</Text>
                        <Text>{desc}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </>
      )}

      {formData?.additional?.length > 0 && (
        <>
          {formData.additional.map((item, index) => (
            <View key={index}>
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
                    fontFamily: 'Helvetica-Bold',
                    textDecoration: 'underline',
                  }}
                >
                  {item.section_Name}
                </Text>
                {item.entries?.map((exp, index) => (
                  <View key={index} style={{ marginTop: 5, fontSize: 9 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                        {exp.title}{' '}
                        {exp?.link && (
                          <Link src={proj.link}>Link</Link>
                        )}
                      </Text>
                      <Text>
                        {exp.start_Date} - {exp.end_Date}
                      </Text>
                    </View>
                    {exp.description && (
                      <View style={{ marginLeft: 4 }}>
                        {exp.description.split('\n').map((desc, index) => (
                          <View key={index} style={{ flexDirection: 'row' }}>
                            <Text style={{ marginRight: 5 }}>•</Text>
                            <Text>{desc}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
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
    categorialSkills: PropTypes.shape({}),
    experience: PropTypes.arrayOf(
      PropTypes.shape({
        // Define the expected properties inside each experience object
      }),
    ),
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        projects: PropTypes.string,
        project_Link: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    additional: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string,
        entries: PropTypes.arrayOf(
          PropTypes.shape({
            title: PropTypes.string,
            start_Date: PropTypes.string,
            end_Date: PropTypes.string,
            description: PropTypes.string,
          }),
        ),
      }),
    ).isRequired,
  }),
};

export default ResumePreview;
