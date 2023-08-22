import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NTimePicker,
  NTreeSelect
} from 'naive-ui'
import { computed, defineComponent, reactive, ref, toRaw, toRefs, watch } from 'vue'
import { searchProps } from './props'
import { SearchColumn } from '../tableProps'
import Modal from '@/components/modal'
import { useI18n } from 'vue-i18n'
import { call } from '@/utils/base'
import { SearchOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  name: 'Search',
  inheritAttrs: false,
  props: searchProps,
  setup(props) {
    const { t } = useI18n()
    const { columns } = toRefs(props)

    const data = reactive({
      columns: columns.value || []
    })
    // 国际化切换
    watch(columns, (val = []) => {
      const map = new Map()
      val.forEach((item) => {
        map.set(item.name, item)
      })
      data.columns.forEach((item) => {
        if (map.has(item.name)) {
          const col = map.get(item.name)
          item.title = col.title
          item.name = col.name
        }
      })
    })

    const valueUpdate = (newValue, item: SearchColumn) => {
      item.value = newValue
    }

    /**
     * 类型组件
     * @param item 数据
     */
    const input = (item: SearchColumn) => {
      if (item.type === 'number') {
        return <NInputNumber clearable disabled={item.disabled} value={item.value} onUpdateValue={(val) => valueUpdate(val, item)} />
      }
      if (item.type === 'select') {
        return (
          <NSelect
            options={item.options}
            disabled={item.disabled}
            value={item.value}
            onUpdateValue={(val) => valueUpdate(val, item)}
            onFocus={() => loadOptions(item)}
            multiple={item.multiple}
            clearable
          />
        )
      }
      if (item.type === 'tree') {
        return (
          <NTreeSelect
            options={item.options}
            disabled={item.disabled}
            keyField='value'
            value={item.value}
            onFocus={() => loadOptions(item)}
            onUpdateValue={(val) => valueUpdate(val, item)}
            multiple={item.multiple}
            clearable
          />
        )
      }
      if (item.type === 'checkbox') {
        return (
          <NCheckboxGroup
            value={item.value}
            disabled={item.disabled}
            onUpdateValue={(val) => valueUpdate(val, item)}
            max={!item.multiple ? 1 : undefined}>
            {item.options &&
              item.options?.map((san) => {
                return <NCheckbox label={san.label} value={san.value} />
              })}
          </NCheckboxGroup>
        )
      }
      if (item.type === 'radio') {
        return (
          <NRadioGroup value={item.value} disabled={item.disabled} onUpdateValue={(val) => valueUpdate(val, item)}>
            {item.options &&
              item.options?.map((san) => {
                return <NRadio label={san.label} value={san.value} />
              })}
          </NRadioGroup>
        )
      }
      if (item.type === 'swith') {
        return (
          <NSwitch
            value={item.value}
            disabled={item.disabled}
            onUpdateValue={(val) => valueUpdate(val, item)}
            checkedValue={1}
            uncheckedValue={0}
          />
        )
      }
      if (item.type === 'time') {
        return (
          <NTimePicker
            class='w-full'
            disabled={item.disabled}
            format={item.format}
            formattedValue={item.value}
            clearable
            onUpdateFormattedValue={(val) => valueUpdate(val, item)}
          />
        )
      }
      if (item.type === 'date') {
        return (
          <NDatePicker
            class='w-full'
            disabled={item.disabled}
            format={item.format}
            type={item.range ? 'daterange' : 'date'}
            formattedValue={item.value}
            clearable
            onUpdateFormattedValue={(val) => valueUpdate(val, item)}
          />
        )
      }
      if (item.type === 'month') {
        return (
          <NDatePicker
            class='w-full'
            disabled={item.disabled}
            format={item.format}
            type={item.range ? 'monthrange' : 'month'}
            formattedValue={item.value}
            clearable
            onUpdateFormattedValue={(val) => valueUpdate(val, item)}
          />
        )
      }
      if (item.type === 'year') {
        return (
          <NDatePicker
            class='w-full'
            disabled={item.disabled}
            format={item.format}
            type={item.range ? 'yearrange' : 'year'}
            formattedValue={item.value}
            clearable
            onUpdateFormattedValue={(val) => valueUpdate(val, item)}
          />
        )
      }
      if (item.type === 'quarter') {
        return (
          <NDatePicker
            class='w-full'
            disabled={item.disabled}
            format={item.format}
            type={item.range ? 'quarterrange' : 'quarter'}
            formattedValue={item.value}
            clearable
            onUpdateFormattedValue={(val) => valueUpdate(val, item)}
          />
        )
      }

      if (item.type === 'custom' && item.custom) {
        return item.custom(item)
      }

      return <NInput value={item.value} onUpdateValue={(val) => valueUpdate(val, item)} maxlength='1000' clearable />
    }

    /**
     * 异步加载数据
     * @param item 字段
     */
    const loadOptions = (item: SearchColumn) => {
      if (item.options && item.options.length > 0) {
        return
      }
      item.async &&
        item.async().then((res) => {
          item.options = res || []
        })
    }

    /**
     *  表单项
     */
    const formItems = () => {
      return data.columns.map((item) => {
        return (
          <NFormItem label={item.title} path={item.name}>
            {input(item)}
          </NFormItem>
        )
      })
    }

    const show = ref(false)

    /**
     * 查询
     */
    const onConfirm = (done) => {
      if (props.onSearch) {
        call(props.onSearch, toRaw(searchValues.value))
      }
      done()
    }

    /**
     * 可搜索的对象
     */
    const searchValues = computed(() => {
      const conditions = {} as RecordAble
      data.columns
        .filter((item) => item.value !== '' && item.value !== null && item.value !== undefined && item.value.length !== 0)
        .forEach((item) => {
          conditions[item.name] = item.value
        })
      return conditions
    })

    /**
     * 重置
     */
    const onCancel = () => {
      data.columns.forEach((item) => {
        item.value = null
      })
      if (props.onReset) {
        call(props.onReset, toRaw(searchValues.value))
      }
    }

    return () => (
      <>
        <Modal
          title={t('component.table.advancedSearch')}
          show={show.value}
          onUpdateShow={(val) => (show.value = val)}
          confirmText={t('component.search.query')}
          cancelText={t('component.search.reset')}
          onCancel={onCancel}
          onConfirm={onConfirm}>
          <NForm label-placement='left' labelWidth='80'>
            {formItems()}
          </NForm>
        </Modal>
        <NSpace size='small'>
          <NButton type='primary' onClick={() => (show.value = true)}>
            <SearchOutlined class='mr-1' />
            {t('component.table.advancedSearch')}
          </NButton>
        </NSpace>
      </>
    )
  }
})
