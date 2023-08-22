import { defineComponent, onMounted, PropType, reactive, ref, watch } from 'vue'
import { getDsConfig, openHistories, openHistoryData, rename } from '@/api/common/file'
import { call } from '@/utils/base'
import { useSettings } from '@/hooks/setting/useSettings'

/**
 * https://api.onlyoffice.com/editors/signature/browser
 * onlyoffice DS 文档服务
 * @author lyc
 * @date 2023-03-01
 */
export default defineComponent({
  name: 'DS',
  props: {
    fileId: {
      type: String as PropType<Key>,
      default: () => ''
    },
    mode: {
      type: String as PropType<DsAPI.mode>,
      default: 'view'
    },
    permission: {
      type: Object as PropType<DsAPI.Permission>
    },
    onReady: {
      type: Function
    }
  },
  setup(props) {
    const { theme } = useSettings()

    const tag = 'data-zkz-ds'
    const id = ref('ds')
    const resData = reactive({
      editor: undefined as unknown as DsAPI.DocEditor,
      dsConfig: {} as DsAPI.FileModel,
      histories: [] as DsAPI.History[]
    })
    /**
     * 加载配置
     */
    const loadApis = () => {
      getDsConfig(props.fileId, props.mode, theme.value, props.permission).then((res) => {
        const { data } = res
        resData.dsConfig = data || {}
        const dsScript = document.head.querySelector(`script[${tag}]`)
        if (dsScript) {
          createEditor()
        } else {
          const script = document.createElement('script')
          script.src = data.serverApiUrl
          script.setAttribute(tag, '')
          script.onload = createEditor
          document.head.appendChild(script)
        }
      })
    }
    /**
     * 创建编辑器
     */
    const createEditor = () => {
      const mode = resData.dsConfig.config.editorConfig?.mode
      resData.dsConfig.config.events = {
        onAppReady,
        onRequestClose, // 关闭编辑器
        onRequestHistoryClose,
        onRequestHistory,
        onRequestHistoryData,
        onRequestRename: mode === 'edit' ? onRequestRename : undefined
      }
      resData.editor = new window.DocsAPI.DocEditor(id.value, resData.dsConfig.config)
    }

    const onAppReady = () => {
      if (props.onReady) {
        call(props.onReady, resData.editor)
      }
    }

    /**
     * 打开历史记录列表
     */
    const onRequestHistory = () => {
      const file = resData.dsConfig.file
      if (!file.id) {
        return
      }
      openHistories(file.id).then((res) => {
        const { data = [] } = res
        resData.histories = data
        resData.editor.refreshHistory({
          currentVersion: file.version,
          history: data
        })
      })
    }
    /**
     * 关闭版本记录
     */
    const onRequestHistoryClose = () => {
      destroyEditor()
      createEditor()
    }
    /**
     * 打开版本记录
     */
    const onRequestHistoryData = (event) => {
      const currentVersion = event.data
      const index = resData.histories.findIndex((item) => item.version === currentVersion)
      if (index < 0) {
        return
      }
      const fileVersionId = resData.histories[index].key
      openHistoryData(fileVersionId).then((res) => {
        resData.editor.setHistoryData(res.data || {})
      })
    }
    /**
     * 修改文件名称
     */
    const onRequestRename = (event) => {
      const title = event.data
      const file = resData.dsConfig.file
      if (!file.id) {
        return
      }
      rename(file.id, title)
    }
    /**
     * 关闭编辑器
     */
    const onRequestClose = () => {
      // resData.editor.destroyEditor()
    }

    /**
     * 销毁编辑器
     */
    const destroyEditor = () => {
      resData.editor.destroyEditor()
    }

    watch(theme, () => {
      destroyEditor()
      loadApis()
    })

    onMounted(() => {
      loadApis()
    })

    return () => (
      <div class='h-full w-full'>
        <div id={id.value} />
      </div>
    )
  }
})
