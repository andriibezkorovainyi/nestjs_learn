export const getProjectPlans = async (
  status: any,
  projectPlans: any,
  user: any,
  staffFilter: any,
  isStaffLoading: any,
  startDate: any,
  endDate: any,
  withWtr: any,
): Promise<Project[] | undefined> => {
  logger.info(`>>>>>> Come in getProjectPlans controller`);
  let previousHeapSize = v8.getHeapStatistics().total_heap_size;
  console.log(`Initial heap size: ${previousHeapSize}`);
  let projects: any = [];
  const userConfig = await UserConfig.findOne({ where: { userId: user.userId } });
  if (user.UserRole.token === 4 || (userConfig?.fullStaffLoading && isStaffLoading) || staffFilter) {
    const filter: any = {};
    if (projectPlans) {
      filter.project = { [Op.in]: projectPlans };
    }
    const modelProjectStaff = {
      model: ProjectPlanStaff,
      where: { userId: staffFilter },
      // separate: true,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    if (!staffFilter) delete modelProjectStaff.where;
    let currentHeapSize = v8.getHeapStatistics().total_heap_size;
    console.log(
      `Heap size before Project.findAll : ${currentHeapSize}, increased by: ${currentHeapSize -
      previousHeapSize}`,
    );
    previousHeapSize = currentHeapSize;

    // REMOVE UNNECESSARY FIELDS
    // USE separate: true for all ManyToMany/OneToMany relations (test it)

    projects = await Project.findAll({
      where: filter,
      include: [
        {
          model: ProjectPlan,
          include: [
            modelProjectStaff,
            {
              model: ProjectPlanFinance
              // separate: true, },
            },
            {
              model: ProjectPlanResult
              // separate: true, },
            },
            {
              model: TerminationReason
              // separate: true, },
            },
            {
              model: ProjectPlanTask
              // separate: true, },
            },
          ],
        },
        {
          model: ProjectType
          // separate: true, },
        },
        {
          model: ProjectSubordinateStaff
          // separate: true, },
        },
        // separate: true,
      ],
      order: [[ProjectPlan, 'startDate']],
    });
    currentHeapSize = v8.getHeapStatistics().total_heap_size;
    console.log(
      `Heap size after Project.findAll : ${currentHeapSize}, increased by: ${currentHeapSize - previousHeapSize}`,
    );
    previousHeapSize = currentHeapSize;
  } else {
    // FOR LEAD
    const projectIds: any = [];
    let filter: any = {};
    if (user.UserRole.token === 2) {
      if (!isStaffLoading) {
        const contracts = await DocContract.findAll({
          where: { isCommercial: false },
          include: [{ model: DocContractProject }],
        });

        contracts.forEach((contract: any) => {
          contract.DocContractProjects.forEach((pr: any) => {
            projectIds.push(pr.projectId);
          });
        });
        filter = {
          id: projectIds,
          project: { [Op.in]: projectPlans },
        };
      }
    } else {
      filter = {
        project: { [Op.in]: projectPlans },
      };
    }
    if (!projectPlans) delete filter['project'];

    const modelProjectStaff = {
      model: ProjectPlanStaff,
      where: { userId: staffFilter },
    };
    if (!staffFilter) {
      console.log('5');
      // TODO: for user role LEAD
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      delete modelProjectStaff.where;
    }
    projects = await Project.findAll({
      where: filter,
      include: [
        {
          model: ProjectPlan,
          include: [
            modelProjectStaff,
            { model: ProjectPlanFinance },
            { model: ProjectPlanResult },
            { model: TerminationReason },
            { model: ProjectPlanTask },
          ],
        },
        { model: ProjectType },
        { model: ProjectSubordinateStaff },
      ],
      order: [[ProjectPlan, 'startDate']],
    });
  }
  let currentHeapSize = v8.getHeapStatistics().total_heap_size;
  console.log(
    `Heap size before  JSON.parse(JSON.stringify(projects)) : ${currentHeapSize}, increased by: ${currentHeapSize -
    previousHeapSize}`,
  );
  previousHeapSize = currentHeapSize;
  projects = JSON.parse(JSON.stringify(projects));
  currentHeapSize = v8.getHeapStatistics().total_heap_size;
  console.log(
    `Heap size after  JSON.parse(JSON.stringify(projects)) : ${currentHeapSize}, increased by: ${currentHeapSize -
    previousHeapSize}`,
  );
  previousHeapSize = currentHeapSize;

  // filter projects by role or subordinates
  if (userConfig?.fullStaffLoading && isStaffLoading) {
    // TODO: add filter or not?
  } else {
    if ([2, 3].includes(user.UserRole.token)) {
      projects = projects.filter((project: any) => {
        return (
          project.pm === user.userId ||
          project.lead === user.userId ||
          project.lg === user.userId ||
          project.qa === user.userId ||
          project.ProjectSubordinateStaffs.some((sub: any) => +sub.userId === +user.userId)
        );
      });
    }
  }
  const planIds: any = [];

  // console.log("planIds " + JSON.stringify(planIds));

  // Mutation: add calculateDate field
  projects.forEach((project: any) => {
    project.ProjectPlans.forEach((plan: any, planIndex: number, planArray: any) => {
      planIds.push(plan.id);
      if (planArray[planIndex + 1] !== undefined) {
        plan['calculateDate'] = planArray[planIndex + 1].startDate;
      } else {
        plan['calculateDate'] = new Date().toISOString();
      }
    });
  });

  // Filter by dates
  if (startDate && endDate) {
    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);
    projects = projects
      .map((project: any) => {
        project['ProjectPlans'] = project.ProjectPlans.filter((p: any) => {
          return new Date(p.startDate).valueOf() <= end && new Date(p.endDate).valueOf() >= start;
        });
        return project;
      })
      .filter((p: any) => p['ProjectPlans'].length > 0);
  }

  // Mutation: add TZ to all plans
  const docTz = await DocContractTz.findAll({ where: { iterationId: planIds } });
  projects.forEach((project: any) => {
    project.ProjectPlans.forEach((plan: any) => {
      const tz = docTz.find(t => t.iterationId === plan.id);
      if (tz) {
        plan['tz'] = tz;
      } else {
        plan['tz'] = null;
      }
    });
  });

  // Filter by status
  if (status && status.length > 0) {
    projects = projects.map((project: any) => {
      project['ProjectPlans'] = project.ProjectPlans.filter((p: any) => status.includes(p.status));
      return project;
    });
  }

  if (withWtr === 'true') {
    let fr omDate = new Date();
    let toDate = new Date();
    projects.forEach((project: any) => {
      project.ProjectPlans.forEach((plan: any, planIndex: number, planArray: any) => {
        if (moment(fr omDate).isAfter(moment(plan.startDate))) {
          fr omDate = plan.startDate;
        }
        if (moment(toDate).isBefore(moment(plan.endDate))) {
          toDate = plan.endDate;
        }
      });
    });
    // console.log('fr omDate ', fr omDate);
    // console.log('toDate ', toDate);

    // console.log('withWtr', withWtr);
    // console.log('projects ', projects.length);
    const fr om = new Date(fr omDate).setHours(0, 0, 0, 0);
    const to = new Date(toDate).setHours(23, 59, 59, 999);
    const configTimeDay = { [Op.between]: [from, to] };

    const userTaskTimes = await UserTaskTimeDay.findAll({
      wh ere: {
      timeDay: configTimeDay,
    },
    raw: true,
  });
    // console.log('userTaskTimes ', userTaskTimes[0]);
    // console.timeEnd('UserTaskTime')

    const uniqueTasks = [...new Set(userTaskTimes.map(t => t.taskId))];
    let tasks = [];
    try {
      // console.time('axiosApiGateway')
      const response = await axiosApiGateway.post(`/api/v2/b24-sync/tasks/groups`, {
        tasks: uniqueTasks,
        groups: projects.map((p: any) => p.project),
        lim it: 1000,
    });
      tasks = response.data.result;
      // console.log('axiosApiGateway response total', response.data.total)
      // console.timeEnd('axiosApiGateway')
    } catch (error) {
      console.log('error', error.message);
    }
    // console.log('userTaskTimes.length', userTaskTimes.length);
    // console.log('projects.length ', projects.length);
    // console.log('tasks fr om b24', tasks.length);

    // console.time('for -!-')

    currentHeapSize = v8.getHeapStatistics().total_heap_size;
    console.log(
      `Heap size before NEW3FOR : ${currentHeapSize}, increased by: ${currentHeapSize - previousHeapSize}`,
    );
    previousHeapSize = currentHeapSize;
    const taskMap = new Map(tasks.map((task: any) => [task.taskId, task]));

    userTaskTimes.forEach(userTaskTime => {
      const start = userTaskTime.timeDay.valueOf();
      const foundTask: any = taskMap.get(userTaskTime.taskId);
      if (!foundTask) return;

      projects.forEach((project: any) => {
        if (project.project === foundTask.groupId) {
          project.ProjectPlans.forEach((plan: any) => {
            const end = new Date(plan.startDate.substr(0, 10)).valueOf();
            const calcDate = new Date(plan.calculateDate.substr(0, 10)).valueOf();

            if (start >= end && start < calcDate) {
              if (plan.totalTime === undefined) {
                plan.totalTime = 0;
              }
              if (plan.manualTime === undefined) {
                plan.manualTime = 0;
              }

              plan.totalTime += Number(userTaskTime.interval);
              plan.manualTime = userTaskTime.isManual ? Number(userTaskTime.interval) : 0;

              const staff = plan.ProjectPlanStaffs.find(
                (staff: any) => +staff.userId === +userTaskTime.userResponsibleId,
              );
              if (staff) {
                if (staff.totalTime === undefined) {
                  staff.totalTime = 0;
                  staff.manualTime = 0;
                  staff.times = [];
                }
                staff.totalTime += +userTaskTime.interval;
                staff.manualTime += userTaskTime.isManual ? +userTaskTime.interval : 0;
                staff.times.push(userTaskTime);
              } else {
                plan.ProjectPlanStaffs.push({
                  comment: '',
                  createdAt: '',
                  id: null,
                  projectPlanId: plan.id,
                  time: -1,
                  totalTime: +userTaskTime.interval,
                  manualTime: userTaskTime.isManual ? +userTaskTime.interval : 0,
                  updatedAt: '',
                  userId: userTaskTime.userResponsibleId,
                  times: [userTaskTime],
              });
              }
            }
          });
        }
      });
    });

    // First code suggestion how to optimize above nested loops

    // for (const userTaskTime of userTaskTimes) {
    //   const start = userTaskTime.timeDay.valueOf();
    //   const foundTask = taskMap.get(userTaskTime.taskId);
    //   if (!foundTask) continue;
    //
    //   const project = projects.find(p => p.project === foundTask.groupId);
    //   if (!project) continue;
    //
    //   for (const plan of project.ProjectPlans) {
    //     const end = new Date(plan.startDate.substr(0, 10)).valueOf();
    //     const calcDate = new Date(plan.calculateDate.substr(0, 10)).valueOf();
    //
    //     if (start >= end && start < calcDate) {
    //       if (plan.totalTime === undefined) {
    //         plan.totalTime = 0;
    //       }
    //       if (plan.manualTime === undefined) {
    //         plan.manualTime = 0;
    //       }
    //
    //       plan.totalTime += Number(userTaskTime.interval);
    //       plan.manualTime = userTaskTime.isManual ? Number(userTaskTime.interval) : 0;
    //
    //       const staff = plan.ProjectPlanStaffs.find(
    //         staff => +staff.userId === +userTaskTime.userResponsibleId
    //       );
    //       if (staff) {
    //         if (staff.totalTime === undefined) {
    //           staff.totalTime = 0;
    //           staff.manualTime = 0;
    //           staff.times = [];
    //         }
    //         staff.totalTime += +userTaskTime.interval;
    //         staff.manualTime += userTaskTime.isManual ? +userTaskTime.interval : 0;
    //         staff.times.push(userTaskTime);
    //       } else {
    //         plan.ProjectPlanStaffs.push({
    //           comment: '',
    //           createdAt: '',
    //           id: null,
    //           projectPlanId: plan.id,
    //           time: -1,
    //           totalTime: +userTaskTime.interval,
    //           manualTime: userTaskTime.isManual ? +userTaskTime.interval : 0,
    //           updatedAt: '',
    //           userId: userTaskTime.userResponsibleId,
    //           times: [userTaskTime],
    //         });
    //       }
    //     }
    //   }
    // }


    currentHeapSize = v8.getHeapStatistics().total_heap_size;
    console.log(
      `Heap size after NEW3FOR : ${currentHeapSize}, increased by: ${currentHeapSize - previousHeapSize}`,
    );
    previousHeapSize = currentHeapSize;
    // console.timeEnd('for -!-')
  }

  return projects;
};
