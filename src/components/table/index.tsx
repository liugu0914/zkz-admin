import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSpin, NAlert, NA, NDataTable, NSpace } from 'naive-ui'
import { useDebounceFn, useResizeObserver } from '@vueuse/core'
import { baseTableProps } from './tableProps'
import { getTableFlexHeight, useSelectRows, useTable } from './useTable'
import css from './css/table.module.css'
import Search from './search'
import { getSearchAbleColumns } from './search/helper'
import { call } from '@/utils/base'

export default defineComponent({
  name: 'BaseTable',
  inheritAttrs: false,
  props: baseTableProps,
  setup(props, { slots, attrs }) {
    const { t } = useI18n()

    const { hasSelect, clearSelectRows } = useSelectRows(props)

    const tableProps = useTable(props, slots)

    const searchColumns = computed(() => {
      return getSearchAbleColumns(props.columns || [])
    })

    /**
     * search 组件
     */
    const searchComponent = () =>
      props.showSearch && searchColumns.value.length > 0 ? (
        <Search columns={searchColumns.value} onSearch={onSearch} onReset={onReset} />
      ) : null

    const onSearch = (values: RecordAble<any>) => {
      if (props.onSearch) {
        call(props.onSearch, values)
      }
    }

    const onReset = (values: RecordAble<any>) => {
      if (props.onReset) {
        call(props.onReset, values)
      }
    }

    /**
     *
     * alter 组件
     */
    const alterComponent = () =>
      hasSelect.value ? (
        <div class='pb-2'>
          <NAlert bordered={false} class={css.tableAlter} type='info'>
            <div class='message'>
              {t('component.table.selectRows', { row: props.checkedRowKeys?.length || 0 })}
              <NA class='float-right font-bold' onClick={clearSelectRows}>
                {t('component.table.clear')}
              </NA>
            </div>
          </NAlert>
        </div>
      ) : null

    // ============ 计算table动态高度 ============
    const tableRef = ref()
    const headerRef = ref()

    const tableStyle = reactive({
      height: undefined as number | undefined
    })

    if (props.flexHeight) {
      // 使用 flexHeight 则开启动态高度
      const calHeight = useDebounceFn(() => {
        const { heigth } = getTableFlexHeight(tableRef, headerRef)
        tableStyle.height = heigth
      }, 100)

      onMounted(() => {
        const tableDom = tableRef.value.$el as HTMLElement
        const content = tableDom.parentElement

        useResizeObserver(content, calHeight)
      })
    }

    const computedAttrs = computed(() => {
      const style = (attrs.style || {}) as any
      if (tableStyle.height) {
        style.height = `${tableStyle.height}px`
      }
      return { ...attrs, style }
    })
    // ============ 计算table动态高度 ============

    return () => (
      <>
        <NSpin show={props.loading} ref={tableRef}>
          <div ref={headerRef}>
            {props.showHeader ? (
              <NSpace class='pb-2' justify='space-between' size='small'>
                <NSpace justify='start' size='small'>
                  {slots.headerTitle ? slots.headerTitle() : null}
                </NSpace>
                <NSpace justify='end' size='small'>
                  {searchComponent()}
                  {slots.btns ? slots.btns() : null}
                </NSpace>
              </NSpace>
            ) : null}
            {alterComponent()}
          </div>
          <NDataTable {...tableProps.value} {...computedAttrs.value}>
            {slots}
          </NDataTable>
        </NSpin>
      </>
    )
  }
})
