const collapCntlr = document.querySelector(".collapsible-controller");
const collapCntlrIcn = document.querySelector(".collapsible-controller > span");
const collapCnt = document.querySelector(".collapsible-content");

const toggleCollapCnt = () => {
  collapCnt.classList.toggle("collapse");

  if (!collapCnt.classList.contains("collapse")) {
    collapCntlrIcn.textContent = "🔼";
  } else {
    collapCntlrIcn.textContent = "🔽";
  }
};

collapCntlr.addEventListener("click", toggleCollapCnt);
