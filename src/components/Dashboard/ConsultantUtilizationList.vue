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
              :class="{ down: !section.visible }"
              class="fa fa-chevron-up rotate"
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

const getMinDate = (projectsArray) => {
  return new Date(Math.min.apply(null, projectsArray.map(project => new Date(project.endDate))))
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
          heading: 'Consultants without a project in the next 3 months'
        },
        {
          id: 2,
          initiallyVisible: false,
          visible: false,
          heading: 'Consultants currently in a project'
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
      'skillsByProfileId',
      'profiles',
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
      const mappedObjects = this.mapSkillsAndProjectsToProfiles()
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
        1: this.initiallyVisibleProfiles,
        2: this.initiallyHiddenProfiles
      }
    }
  },
  methods: {
    mapSkillsAndProjectsToProfiles () {
      // First, get profiles, filtered by name
      const profilesWithoutSkills = Object.values(this.profiles)
      // Then map skills and projects for each profile
      return profilesWithoutSkills.map(profile => {
        const projects = this.futureProjectsOfProfile(profile.id)
        let utilizationOnSelectedDate = 0
        projects.map(project => {
          utilizationOnSelectedDate += project.workPercentage
        })
        return {
          profile: profile,
          skills: this.skillsByProfileId(profile.id),
          projects: projects,
          utilization: utilizationOnSelectedDate,
          daysToZeroUtilization: projects.length > 0 ? differenceInDays(getMinDate(projects), Date.now()) : 0
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
.rotate {
    -moz-transition: all .5s linear;
    -webkit-transition: all .5s linear;
    transition: all .5s linear;
}
.rotate.down {
    -moz-transform:rotate(-180deg);
    -webkit-transform:rotate(-180deg);
    transform:rotate(-180deg);
}
</style>
