<template>
  <chart-card>
    <template slot="header">
      <div class="h3 px-2">
        Consultants
      </div>
    </template>
    <b-col
      role="tablist"
      class="mx-2 mb-1"
    >
      <b-card
        v-for="(section, index) in sections"
        :key="'utilization-list-' + index"
        no-body
        class="mb-1 rounded"
      >
        <b-card-header
          header-tag="header"
          class="p-1"
          role="tab"
        >
          <b-button
            :id="'toggle-section-' + index"
            v-b-toggle="'section-' + index"
            block
            variant="light"
            @click.prevent="section.visible=!section.visible"
          >
            {{ section.heading }}
            <i
              :class="section.visible ? 'fa-chevron-up' : 'fa-chevron-down'"
              class="fa"
            />
          </b-button>
        </b-card-header>
        <b-collapse
          :id="'section-' + index"
          :visible="section.initiallyVisible"
          role="tabpanel"
        >
          <b-card-body>
            <b-row
              v-for="(item, itemIndex) in sectionsData[section.id]"
              :key="item.profile.id"
              class="align-items-end"
            >
              <b-col
                cols="2"
                class="ml-4"
              >
                <span
                  class="employee-name"
                  @click="openProfile(item.profile)"
                >
                  {{ item.profile.firstName }} {{ item.profile.lastName }}
                </span>
              </b-col>
              <b-col
                cols="9"
                class="mb-1"
              >
                <utilization-chart
                  v-if="itemIndex === 0"
                  :projects="item.projects"
                  :override-options="chartOptionsForFirstItem"
                  height="25px"
                />
                <utilization-chart
                  v-if="itemIndex > 0"
                  :projects="item.projects"
                  :override-options="overrideChartOptions"
                  height="20px"
                />
              </b-col>
            </b-row>
          </b-card-body>
        </b-collapse>
      </b-card>
    </b-col>
  </chart-card>
</template>

<script>
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters } from 'vuex'
import { differenceInDays } from 'date-fns'
import { UtilizationChart } from '../Profile'
import ChartCard from './ChartCard'

const getMaxDate = (projectsArray) => {
  const projectsEndDates = projectsArray.filter(project => !!project.endDate).map(project => new Date(project.endDate))
  return projectsEndDates.length > 0 ? new Date(Math.max.apply(null, projectsEndDates)) : undefined
}

export default {
  name: 'ConsultantUtilizationList',
  components: {
    ChartCard,
    UtilizationChart
  },
  props: {},
  data () {
    return {
      sections: [
        {
          id: 1,
          initiallyVisible: true,
          visible: true,
          heading: 'Developers soon to be without a project'
        },
        {
          id: 2,
          initiallyVisible: false,
          visible: false,
          heading: 'Rest of the developers sorted by utilization'
        },
        {
          id: 3,
          initiallyVisible: false,
          visible: false,
          heading: 'Agile coaches soon to be  without a project'
        },
        {
          id: 4,
          initiallyVisible: false,
          visible: false,
          heading: 'Rest of the agile coaches sorted by utilization'
        }
      ],
      hideThresholdInDays: 90,
      overrideChartOptions: {
        layout: {
          padding: {
            left: 15,
            right: 15
          }
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false
              },
              position: 'top'
            }
          ],
          yAxes: [{ display: false }]
        },
        legend: {
          display: false
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'profileFilter',
      'futureProjectsOfProfile',
      'profileProjectsByProfileId'
    ]),
    chartOptionsForFirstItem () {
      const optionsCopy = cloneDeep(this.overrideChartOptions)
      const overrideOptions = {
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                displayFormats: {
                  month: 'MMM'
                }
              },
              ticks: {
                display: true,
                padding: -10
              },
              position: 'top'
            }
          ]
        }
      }
      return merge(optionsCopy, overrideOptions)
    },
    orderedProfiles () {
      // Filter out profiles having only administrative role
      const mappedObjects = this.mapProjectsToProfiles().filter(item => item.profile.employeeRoles.every(i => [1, 2].includes(i)))
      return mappedObjects.sort((a, b) => a.utilization === 0 ? a.utilization - b.utilization : a.daysToZeroUtilization - b.daysToZeroUtilization)
    },
    initiallyVisibleProfiles () {
      return this.orderedProfiles.filter(item => item.daysToZeroUtilization <= this.hideThresholdInDays)
    },
    initiallyHiddenProfiles () {
      return this.orderedProfiles.filter(item => item.daysToZeroUtilization > this.hideThresholdInDays)
    },
    sectionsData () {
      return {
        1: this.initiallyVisibleProfiles.filter(item => item.profile.employeeRoles.includes(1)),
        2: this.initiallyHiddenProfiles.filter(item => item.profile.employeeRoles.includes(1)),
        3: this.initiallyVisibleProfiles.filter(item => !item.profile.employeeRoles.includes(1)),
        4: this.initiallyHiddenProfiles.filter(item => !item.profile.employeeRoles.includes(1))
      }
    }
  },
  methods: {
    mapProjectsToProfiles () {
      const activeProfiles = this.profileFilter()
      // Map projects for each active profile
      return Object.values(activeProfiles).map(profile => {
        const projects = this.futureProjectsOfProfile(profile.id)
        let utilizationOnSelectedDate = 0
        projects.map(project => {
          utilizationOnSelectedDate += project.workPercentage
        })
        let daysToZeroUtilization = 0
        if (projects.length > 0) {
          // Handle projects without end date
          daysToZeroUtilization = getMaxDate(projects) ? differenceInDays(getMaxDate(projects), Date.now()) : 100000
        }
        return {
          profile: profile,
          projects: projects,
          utilization: utilizationOnSelectedDate,
          daysToZeroUtilization: daysToZeroUtilization
        }
      })
    },
    openProfile (profile) {
      this.$router.push({ name: 'profile', params: { id: profile.id } })
    }
  }
}
</script>

<style scoped>
.btn {
  font-size: 18px;
  font-weight: 500;
}
.employee-name {
  cursor: pointer;
}
.employee-name:hover {
  font-weight: bolder;
}
</style>
