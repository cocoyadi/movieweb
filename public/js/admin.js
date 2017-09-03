
/**
 * Created by yadi_coco on 2017/8/17.
 */
$(function(){
    $(".del").click(function(){
    var $this=$(this)
        var id=$this.data("id")
        //拿到表格中的这行数据，在效果上表现为该行数据被删除
        var tr=$(".item-id-"+id)
        $.ajax({
            type:"DELETE",
            url:"/admin/movie/list?id="+id
        })
        .done(function(result){
            if(result.success===1){
                if(tr.length>0){
                    alert("删除成功");
                } tr.remove()
            }
        })
    })
})