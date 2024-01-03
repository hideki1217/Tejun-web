import * as React from "react"


type DeleteIconProps = {
    fill?: string,
    size: number,
}
const DeleteIcon: React.FC<DeleteIconProps> = ({ fill = "#000", size }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        width={size}
        height={size}
        fill={fill}
        viewBox="0 0 354.319 354.319"
    >
        <path d="m293.765 125.461-41.574-17.221 17.221-41.574c3.17-7.654-.464-16.428-8.118-19.599L150.428 1.146c-7.653-3.17-16.428.464-19.598 8.118l-17.221 41.574-41.574-17.221c-7.654-3.17-16.428.464-19.599 8.118-3.17 7.654.464 16.428 8.118 19.599l55.433 22.961 96.628 40.024H87.16c-8.284 0-15 6.716-15 15v200c0 8.284 6.716 15 15 15h180c8.284 0 15-6.716 15-15V153.126l.125.052a14.962 14.962 0 0 0 5.734 1.146c5.886 0 11.472-3.487 13.864-9.264 3.17-7.654-.464-16.429-8.118-19.599zM141.326 62.318l11.48-27.716 83.148 34.441-11.48 27.716-41.574-17.22-41.574-17.221z" />
    </svg>
)
export default DeleteIcon;