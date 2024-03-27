import Mock from 'mockjs'
import { customAlphabet } from 'nanoid'

Mock.setup({
  timeout: '10-100'
})

const baseUrl = '/api'
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 8)
// const Random = Mock.Random

const workflow_data = {
  group: [
    {
      id: nanoid(),
      type: 0,
      title: '开始',
      body: '',
      approver: ''
    },
    {
      id: nanoid(),
      type: 7,
      branches: [
        {
          group: [
            { id: nanoid(), type: 2, title: '审批', body: '', approver: '' },
            { id: nanoid(), type: 2, title: '审批', body: '', approver: '' }
          ]
        },
        {
          group: [{ id: nanoid(), type: 2, title: '审批', body: '', approver: '' }]
        }
      ]
    },
    {
      id: nanoid(),
      type: 5,
      branches: [
        {
          id: nanoid(),
          type: 6,
          title: '条件1',
          priority: 1,
          body: '',
          group: [
            { id: nanoid(), type: 2, title: '审批', body: '' },
            {
              id: nanoid(),
              type: 5,
              branches: [
                {
                  id: nanoid(),
                  type: 6,
                  title: '条件A',
                  priority: 1,
                  body: '',
                  group: [{ id: nanoid(), type: 2, title: '审批', body: '' }]
                },
                {
                  id: nanoid(),
                  type: 6,
                  title: '条件B',
                  priority: 2,
                  body: '',
                  group: [
                    { id: nanoid(), type: 2, title: '审批', body: '' },
                    { id: nanoid(), type: 3, title: '办理', body: '' }
                  ]
                },
                {
                  id: nanoid(),
                  type: 6,
                  title: '默认条件',
                  priority: 3,
                  default: true,
                  body: '',
                  group: [{ id: nanoid(), type: 2, title: '审批2', body: '' }]
                }
              ]
            },
            { id: nanoid(), type: 3, title: '办理', body: '' },
            { id: nanoid(), type: 4, title: '抄送', body: '' }
          ]
        },
        {
          id: nanoid(),
          type: 6,
          title: '条件2A',
          priority: 2,
          body: '',
          default: true,
          group: [{ id: nanoid(), type: 2, title: '审批2', body: '' }]
        }
      ]
    },
    {
      id: nanoid(),
      type: 1,
      title: '结束',
      body: '',
      approver: '用户a'
    }
  ]
}

const dept_data = [
  {
    dept_id: '1',
    name: '猫猫集团',
    fullname: '猫猫',
    type: 0,
    is_entity: false,
    leader_id: null,
    leader_name: '张三',
    show_orders: 0,
    status: 1,
    children: [
      {
        dept_id: '2',
        name: '销售支持部',
        fullname: '猫猫集团-销售支持部',
        type: 0,
        is_entity: false,
        leader_id: null,
        leader_name: '周二二',
        show_orders: 0,
        status: 1,
        children: [
          {
            dept_id: '100',
            name: '市场部',
            fullname: '猫猫集团-市场部',
            type: 0,
            is_entity: false,
            leader_id: null,
            leader_name: '张四',
            show_orders: 0,
            status: 1,
            children: []
          }
        ]
      },
      {
        dept_id: '3',
        name: '市场部',
        fullname: '猫猫集团-市场部',
        type: 0,
        is_entity: false,
        leader_id: null,
        leader_name: '周二三',
        show_orders: 0,
        status: 1,
        children: []
      },
      {
        dept_id: '4',
        name: '研发中心',
        fullname: '猫猫集团-研发中心',
        type: 0,
        is_entity: false,
        leader_id: null,
        leader_name: '陈伟',
        show_orders: 0,
        status: 1,
        children: [
          {
            dept_id: '5',
            name: '产品部',
            fullname: '猫猫集团-产品部',
            type: 0,
            is_entity: false,
            parent_id: '4',
            leader_id: null,
            leader_name: '周二二',
            show_orders: 0,
            status: 1,
            children: []
          },
          {
            dept_id: '6',
            name: '技术部',
            fullname: '猫猫集团-技术部',
            type: 0,
            is_entity: false,
            leader_id: null,
            leader_name: '黄三',
            show_orders: 0,
            status: 1,
            children: []
          }
        ]
      },
      {
        dept_id: '7',
        name: '区域公司',
        fullname: '猫猫集团-区域公司',
        type: 0,
        is_entity: false,
        leader_id: null,
        leader_name: '黄五',
        show_orders: 0,
        status: 1,
        children: [
          {
            dept_id: '8',
            name: '华东区域',
            fullname: '猫猫集团-华东区域',
            type: 0,
            is_entity: false,
            leader_id: null,
            leader_name: '赵六六',
            show_orders: 0,
            status: 1,
            children: []
          },
          {
            dept_id: '9',
            name: '华东区域',
            fullname: '猫猫集团-华北区域',
            type: 0,
            is_entity: false,
            leader_id: null,
            leader_name: '露琪亚诺',
            show_orders: 0,
            status: 1,
            children: []
          }
        ]
      }
    ]
  }
]
// Mock.mock(RegExp(`${baseUrl}/project/get\\?id=*`), 'get', () => {
//   const data = {
//     ver: '1.0',
//     settings: {},
//     data: [
//       {
//         title: Random.cparagraph(1, 2),
//         id: nanoid(),
//         type: 'MultiChoice',
//         required: true,
//         data: [
//           { name: '<p>123123123<vue-component /></p>', id: nanoid(), fill: { isShow: true, length: 20, type: 'text' } },
//           { name: Random.cparagraph(1, 2), id: nanoid(), fill: { isShow: false } },
//           { name: Random.cparagraph(1, 2), id: nanoid(), fill: { isShow: false } }
//         ]
//       },
//       {
//         title: Random.cparagraph(1, 2),
//         id: nanoid(),
//         type: 'MultiChoice',
//         required: true,
//         data: [
//           { name: Random.cparagraph(1, 2), id: nanoid(), fill: { isShow: false } },
//           { name: Random.cparagraph(1, 2), id: nanoid(), fill: { isShow: false } },
//           { name: Random.cparagraph(1, 2), id: nanoid(), fill: { isShow: false } }
//         ]
//       }
//     ]
//   }
//   return data
// })

Mock.mock(RegExp(`${baseUrl}/workflow/get\\?id=*`), 'get', () => {
  return workflow_data
})

Mock.mock(RegExp(`${baseUrl}/dept/get\\?id=*`), 'get', () => {
  return dept_data
})
