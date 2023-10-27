import { useCollectionQuery, useDocument } from "@zachsents/fire-query"
import { where } from "firebase/firestore"
import { useRouter } from "next/router"
import { TbBrandAirtable, TbBrandAsana, TbBrandAzure, TbBrandBitbucket, TbBrandFacebook, TbBrandGithub, TbBrandGitlab, TbBrandGmail, TbBrandGoogle, TbBrandGoogleDrive, TbBrandSlack, TbBrandStripe, TbBrandTrello, TbBrandX, TbBrandZoom, TbForms, TbTable } from "react-icons/tb"
import { useUser } from "reactfire"
import { CONNECTED_ACCOUNTS_SUBCOLLECTION, SERVICE_CLIENTS_COLLECTION } from "shared/firestore"


export function useServiceClients() {
    const { data: user } = useUser()
    return useCollectionQuery([SERVICE_CLIENTS_COLLECTION], [
        user && where("owner", "==", user?.uid),
    ])
}


export function useServiceClient(id) {
    return useDocument([SERVICE_CLIENTS_COLLECTION, id])
}


export function useCurrentServiceClient() {
    const router = useRouter()
    return useServiceClient(router.query.serviceClientId)
}


export function useServiceClientAccountCount(id) {
    return useCollectionQuery([SERVICE_CLIENTS_COLLECTION, id, CONNECTED_ACCOUNTS_SUBCOLLECTION], undefined, {
        aggregation: "count",
    })
}


export function useServiceClientAccounts(id) {
    return useCollectionQuery([SERVICE_CLIENTS_COLLECTION, id, CONNECTED_ACCOUNTS_SUBCOLLECTION])
}


export const Services = [
    {
        id: "gmail",
        name: "Gmail",
        icon: TbBrandGmail,
        color: "red",
        built: true,
        canCreateClient: false,
    },
    {
        id: "airtable",
        name: "Airtable",
        icon: TbBrandAirtable,
        color: "yellow",
        built: true,
        dashboardName: "Airtable Developers",
        scopesListUrl: "https://airtable.com/developers/web/api/scopes",
        scopesList: [
            "data.records:read",
            "data.records:write",
            "data.recordComments:read",
            "data.recordComments:write",
            "schema.bases:read",
            "schema.bases:write",
            "webhook:manage",
            "block:manage",
            "user.email:read",
            "enterprise.groups:read",
            "workspacesAndBases:read",
            "workspacesAndBases:write",
            "workspacesAndBases.shares:manage",
            "enterprise.scim.usersAndGroups:manage",
            "enterprise.auditLogs:read",
            "enterprise.changeEvents:read",
            "enterprise.account:read",
            "enterprise.user:read",
            "enterprise.user:write",
            "workspacesAndBases:manage",
        ],
        canCreateClient: true,
    },
    {
        id: "google-sheets",
        name: "Google Sheets",
        icon: TbTable,
        color: "green",
        built: true,
        canCreateClient: false,
    },
    {
        id: "google-forms",
        name: "Google Forms",
        icon: TbForms,
        color: "violet",
        built: true,
        canCreateClient: false,
    },
    {
        id: "google-drive",
        name: "Google Drive",
        icon: TbBrandGoogleDrive,
        color: "yellow",
        built: true,
        canCreateClient: false,
    },
    {
        id: "google",
        name: "Google",
        icon: TbBrandGoogle,
        color: "blue",
        built: true,
        hidden: true,
        dashboardName: "Google Cloud Console",
        scopesListUrl: "https://developers.google.com/identity/protocols/oauth2/scopes",
        scopesList: [
            "https://www.googleapis.com/auth/cloud-platform",
            "https://www.googleapis.com/auth/cloud-platform.read-only",
            "https://www.googleapis.com/auth/adexchange.buyer",
            "https://www.googleapis.com/auth/admob.readonly",
            "https://www.googleapis.com/auth/admob.report",
            "https://www.googleapis.com/auth/adsensehost",
            "https://www.googleapis.com/auth/admin.reports.audit.readonly",
            "https://www.googleapis.com/auth/admin.reports.usage.readonly",
            "https://www.googleapis.com/auth/admin.datatransfer",
            "https://www.googleapis.com/auth/admin.datatransfer.readonly",
            "https://www.googleapis.com/auth/admin.chrome.printers",
            "https://www.googleapis.com/auth/admin.chrome.printers.readonly",
            "https://www.googleapis.com/auth/admin.directory.customer",
            "https://www.googleapis.com/auth/admin.directory.customer.readonly",
            "https://www.googleapis.com/auth/admin.directory.device.chromeos",
            "https://www.googleapis.com/auth/admin.directory.device.chromeos.readonly",
            "https://www.googleapis.com/auth/admin.directory.device.mobile",
            "https://www.googleapis.com/auth/admin.directory.device.mobile.action",
            "https://www.googleapis.com/auth/admin.directory.device.mobile.readonly",
            "https://www.googleapis.com/auth/admin.directory.domain",
            "https://www.googleapis.com/auth/admin.directory.domain.readonly",
            "https://www.googleapis.com/auth/admin.directory.group",
            "https://www.googleapis.com/auth/admin.directory.group.member",
            "https://www.googleapis.com/auth/admin.directory.group.member.readonly",
            "https://www.googleapis.com/auth/admin.directory.group.readonly",
            "https://www.googleapis.com/auth/admin.directory.orgunit",
            "https://www.googleapis.com/auth/admin.directory.orgunit.readonly",
            "https://www.googleapis.com/auth/admin.directory.resource.calendar",
            "https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly",
            "https://www.googleapis.com/auth/admin.directory.rolemanagement",
            "https://www.googleapis.com/auth/admin.directory.rolemanagement.readonly",
            "https://www.googleapis.com/auth/admin.directory.user",
            "https://www.googleapis.com/auth/admin.directory.user.alias",
            "https://www.googleapis.com/auth/admin.directory.user.alias.readonly",
            "https://www.googleapis.com/auth/admin.directory.user.readonly",
            "https://www.googleapis.com/auth/admin.directory.user.security",
            "https://www.googleapis.com/auth/admin.directory.userschema",
            "https://www.googleapis.com/auth/admin.directory.userschema.readonly",
            "https://www.googleapis.com/auth/analytics",
            "https://www.googleapis.com/auth/analytics.readonly",
            "https://www.googleapis.com/auth/androidmanagement",
            "https://www.googleapis.com/auth/appengine.admin",
            "https://www.googleapis.com/auth/documents",
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/forms",
            "https://www.googleapis.com/auth/forms.currentonly",
            "https://www.googleapis.com/auth/groups",
            "https://www.googleapis.com/auth/script.deployments",
            "https://www.googleapis.com/auth/script.deployments.readonly",
            "https://www.googleapis.com/auth/script.metrics",
            "https://www.googleapis.com/auth/script.processes",
            "https://www.googleapis.com/auth/script.projects",
            "https://www.googleapis.com/auth/script.projects.readonly",
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/bigquery",
            "https://www.googleapis.com/auth/bigquery.insertdata",
            "https://www.googleapis.com/auth/devstorage.full_control",
            "https://www.googleapis.com/auth/devstorage.read_only",
            "https://www.googleapis.com/auth/devstorage.read_write",
            "https://www.googleapis.com/auth/blogger",
            "https://www.googleapis.com/auth/blogger.readonly",
            "https://www.googleapis.com/auth/books",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/calendar.events.readonly",
            "https://www.googleapis.com/auth/calendar.readonly",
            "https://www.googleapis.com/auth/calendar.settings.readonly",
            "https://www.googleapis.com/auth/ddmconversions",
            "https://www.googleapis.com/auth/dfareporting",
            "https://www.googleapis.com/auth/dfatrafficking",
            "https://www.googleapis.com/auth/bigtable.admin",
            "https://www.googleapis.com/auth/bigtable.admin.cluster",
            "https://www.googleapis.com/auth/bigtable.admin.instance",
            "https://www.googleapis.com/auth/bigtable.admin.table",
            "https://www.googleapis.com/auth/cloud-bigtable.admin",
            "https://www.googleapis.com/auth/cloud-bigtable.admin.cluster",
            "https://www.googleapis.com/auth/cloud-bigtable.admin.table",
            "https://www.googleapis.com/auth/cloud-billing",
            "https://www.googleapis.com/auth/cloud-billing.readonly",
            "https://www.googleapis.com/auth/ndev.clouddns.readonly",
            "https://www.googleapis.com/auth/ndev.clouddns.readwrite",
            "https://www.googleapis.com/auth/datastore",
            "https://www.googleapis.com/auth/cloud_debugger",
            "https://www.googleapis.com/auth/ndev.cloudman",
            "https://www.googleapis.com/auth/ndev.cloudman.readonly",
            "https://www.googleapis.com/auth/cloud-identity.devices.lookup",
            "https://www.googleapis.com/auth/cloud-identity.groups",
            "https://www.googleapis.com/auth/cloud-identity.groups.readonly",
            "https://www.googleapis.com/auth/cloudkms",
            "https://www.googleapis.com/auth/logging.admin",
            "https://www.googleapis.com/auth/logging.read",
            "https://www.googleapis.com/auth/logging.write",
            "https://www.googleapis.com/auth/monitoring",
            "https://www.googleapis.com/auth/monitoring.read",
            "https://www.googleapis.com/auth/monitoring.write",
            "https://www.googleapis.com/auth/cloud-language",
            "https://www.googleapis.com/auth/compute",
            "https://www.googleapis.com/auth/compute.readonly",
            "https://www.googleapis.com/auth/pubsub",
            "https://www.googleapis.com/auth/cloudruntimeconfig",
            "https://www.googleapis.com/auth/sqlservice.admin",
            "https://www.googleapis.com/auth/cloud_search",
            "https://www.googleapis.com/auth/cloud_search.debug",
            "https://www.googleapis.com/auth/cloud_search.indexing",
            "https://www.googleapis.com/auth/cloud_search.query",
            "https://www.googleapis.com/auth/cloud_search.settings",
            "https://www.googleapis.com/auth/cloud_search.settings.indexing",
            "https://www.googleapis.com/auth/cloud_search.settings.query",
            "https://www.googleapis.com/auth/cloud_search.stats",
            "https://www.googleapis.com/auth/cloud_search.stats.indexing",
            "https://www.googleapis.com/auth/source.full_control",
            "https://www.googleapis.com/auth/source.read_only",
            "https://www.googleapis.com/auth/source.read_write",
            "https://www.googleapis.com/auth/spanner.admin",
            "https://www.googleapis.com/auth/spanner.data",
            "https://www.googleapis.com/auth/trace.append",
            "https://www.googleapis.com/auth/cloud-translation",
            "https://www.googleapis.com/auth/cloud-vision",
            "https://www.googleapis.com/auth/content",
            "https://www.googleapis.com/auth/drive.activity",
            "https://www.googleapis.com/auth/drive.activity.readonly",
            "https://www.googleapis.com/auth/apps.licensing",
            "https://www.googleapis.com/auth/firebase.messaging",
            "https://www.googleapis.com/auth/firebase",
            "https://www.googleapis.com/auth/firebase.readonly",
            "https://www.googleapis.com/auth/fitness.activity.read",
            "https://www.googleapis.com/auth/fitness.activity.write",
            "https://www.googleapis.com/auth/fitness.blood_glucose.read",
            "https://www.googleapis.com/auth/fitness.blood_glucose.write",
            "https://www.googleapis.com/auth/fitness.blood_pressure.read",
            "https://www.googleapis.com/auth/fitness.blood_pressure.write",
            "https://www.googleapis.com/auth/fitness.body.read",
            "https://www.googleapis.com/auth/fitness.body.write",
            "https://www.googleapis.com/auth/fitness.body_temperature.read",
            "https://www.googleapis.com/auth/fitness.body_temperature.write",
            "https://www.googleapis.com/auth/fitness.heart_rate.read",
            "https://www.googleapis.com/auth/fitness.heart_rate.write",
            "https://www.googleapis.com/auth/fitness.location.read",
            "https://www.googleapis.com/auth/fitness.location.write",
            "https://www.googleapis.com/auth/fitness.nutrition.read",
            "https://www.googleapis.com/auth/fitness.nutrition.write",
            "https://www.googleapis.com/auth/fitness.oxygen_saturation.read",
            "https://www.googleapis.com/auth/fitness.oxygen_saturation.write",
            "https://www.googleapis.com/auth/fitness.reproductive_health.read",
            "https://www.googleapis.com/auth/fitness.reproductive_health.write",
            "https://www.googleapis.com/auth/fitness.sleep.read",
            "https://www.googleapis.com/auth/fitness.sleep.write",
            "https://www.googleapis.com/auth/genomics",
            "https://www.googleapis.com/auth/gmail.addons.current.action.compose",
            "https://www.googleapis.com/auth/gmail.addons.current.message.action",
            "https://www.googleapis.com/auth/gmail.addons.current.message.metadata",
            "https://www.googleapis.com/auth/gmail.addons.current.message.readonly",
            "https://www.googleapis.com/auth/gmail.compose",
            "https://www.googleapis.com/auth/gmail.insert",
            "https://www.googleapis.com/auth/gmail.labels",
            "https://www.googleapis.com/auth/gmail.metadata",
            "https://www.googleapis.com/auth/gmail.modify",
            "https://www.googleapis.com/auth/gmail.readonly",
            "https://www.googleapis.com/auth/gmail.send",
            "https://www.googleapis.com/auth/gmail.settings.basic",
            "https://www.googleapis.com/auth/gmail.settings.sharing",
            "https://www.googleapis.com/auth/analytics.edit",
            "https://www.googleapis.com/auth/analytics.manage.users",
            "https://www.googleapis.com/auth/analytics.manage.users.readonly",
            "https://www.googleapis.com/auth/analytics.provision",
            "https://www.googleapis.com/auth/analytics.user.deletion",
            "https://www.googleapis.com/auth/chat.delete",
            "https://www.googleapis.com/auth/chat.memberships",
            "https://www.googleapis.com/auth/chat.memberships.app",
            "https://www.googleapis.com/auth/chat.memberships.readonly",
            "https://www.googleapis.com/auth/chat.messages",
            "https://www.googleapis.com/auth/chat.messages.create",
            "https://www.googleapis.com/auth/chat.messages.reactions",
            "https://www.googleapis.com/auth/chat.messages.reactions.create",
            "https://www.googleapis.com/auth/chat.messages.reactions.readonly",
            "https://www.googleapis.com/auth/chat.messages.readonly",
            "https://www.googleapis.com/auth/chat.spaces",
            "https://www.googleapis.com/auth/chat.spaces.create",
            "https://www.googleapis.com/auth/chat.spaces.readonly",
            "https://www.googleapis.com/auth/classroom.announcements",
            "https://www.googleapis.com/auth/classroom.announcements.readonly",
            "https://www.googleapis.com/auth/classroom.courses",
            "https://www.googleapis.com/auth/classroom.courses.readonly",
            "https://www.googleapis.com/auth/classroom.coursework.me",
            "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
            "https://www.googleapis.com/auth/classroom.coursework.students",
            "https://www.googleapis.com/auth/classroom.coursework.students.readonly",
            "https://www.googleapis.com/auth/classroom.courseworkmaterials",
            "https://www.googleapis.com/auth/classroom.courseworkmaterials.readonly",
            "https://www.googleapis.com/auth/classroom.guardianlinks.me.readonly",
            "https://www.googleapis.com/auth/classroom.guardianlinks.students",
            "https://www.googleapis.com/auth/classroom.guardianlinks.students.readonly",
            "https://www.googleapis.com/auth/classroom.profile.emails",
            "https://www.googleapis.com/auth/classroom.profile.photos",
            "https://www.googleapis.com/auth/classroom.push-notifications",
            "https://www.googleapis.com/auth/classroom.rosters",
            "https://www.googleapis.com/auth/classroom.rosters.readonly",
            "https://www.googleapis.com/auth/classroom.student-submissions.me.readonly",
            "https://www.googleapis.com/auth/classroom.student-submissions.students.readonly",
            "https://www.googleapis.com/auth/classroom.topics",
            "https://www.googleapis.com/auth/classroom.topics.readonly",
            "https://www.googleapis.com/auth/documents.readonly",
            "https://www.googleapis.com/auth/drive.file",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/drive.appdata",
            "https://www.googleapis.com/auth/drive.metadata",
            "https://www.googleapis.com/auth/drive.metadata.readonly",
            "https://www.googleapis.com/auth/drive.photos.readonly",
            "https://www.googleapis.com/auth/drive.scripts",
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/androidpublisher",
            "https://www.googleapis.com/auth/androidenterprise",
            "https://www.googleapis.com/auth/games",
            "https://www.googleapis.com/auth/webmasters",
            "https://www.googleapis.com/auth/webmasters.readonly",
            "https://www.googleapis.com/auth/spreadsheets.readonly",
            "https://www.googleapis.com/auth/siteverification",
            "https://www.googleapis.com/auth/siteverification.verify_only",
            "https://www.googleapis.com/auth/presentations",
            "https://www.googleapis.com/auth/presentations.readonly",
            "https://www.googleapis.com/auth/tasks",
            "https://www.googleapis.com/auth/tasks.readonly",
            "https://www.googleapis.com/auth/ediscovery",
            "https://www.googleapis.com/auth/ediscovery.readonly",
            "https://www.googleapis.com/auth/apps.alerts",
            "https://www.googleapis.com/auth/apps.order",
            "https://www.googleapis.com/auth/apps.order.readonly",
            "https://www.googleapis.com/auth/apps.groups.migration",
            "https://www.googleapis.com/auth/apps.groups.settings",
            "https://www.googleapis.com/auth/indexing",
            "https://www.googleapis.com/auth/manufacturercenter",
            "https://www.googleapis.com/auth/contacts",
            "https://www.googleapis.com/auth/contacts.other.readonly",
            "https://www.googleapis.com/auth/contacts.readonly",
            "https://www.googleapis.com/auth/directory.readonly",
            "https://www.googleapis.com/auth/user.addresses.read",
            "https://www.googleapis.com/auth/user.birthday.read",
            "https://www.googleapis.com/auth/user.emails.read",
            "https://www.googleapis.com/auth/user.gender.read",
            "https://www.googleapis.com/auth/user.organization.read",
            "https://www.googleapis.com/auth/user.phonenumbers.read",
            "https://www.googleapis.com/auth/photoslibrary",
            "https://www.googleapis.com/auth/photoslibrary.appendonly",
            "https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata",
            "https://www.googleapis.com/auth/photoslibrary.readonly",
            "https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata",
            "https://www.googleapis.com/auth/photoslibrary.sharing",
            "https://www.googleapis.com/auth/sasportal",
            "https://www.googleapis.com/auth/doubleclicksearch",
            "https://www.googleapis.com/auth/service.management",
            "https://www.googleapis.com/auth/service.management.readonly",
            "https://www.googleapis.com/auth/streetviewpublish",
            "https://www.googleapis.com/auth/tagmanager.delete.containers",
            "https://www.googleapis.com/auth/tagmanager.edit.containers",
            "https://www.googleapis.com/auth/tagmanager.edit.containerversions",
            "https://www.googleapis.com/auth/tagmanager.manage.accounts",
            "https://www.googleapis.com/auth/tagmanager.manage.users",
            "https://www.googleapis.com/auth/tagmanager.publish",
            "https://www.googleapis.com/auth/tagmanager.readonly",
            "https://www.googleapis.com/auth/youtube",
            "https://www.googleapis.com/auth/youtube.readonly",
            "https://www.googleapis.com/auth/youtubepartner",
            "https://www.googleapis.com/auth/yt-analytics-monetary.readonly",
            "https://www.googleapis.com/auth/yt-analytics.readonly",
            "https://www.googleapis.com/auth/youtube.channel-memberships.creator",
            "https://www.googleapis.com/auth/youtube.force-ssl",
            "https://www.googleapis.com/auth/youtube.upload",
            "https://www.googleapis.com/auth/youtubepartner-channel-audit"
        ],
        canCreateClient: true,
    },
    {
        id: "facebook",
        name: "Facebook",
        icon: TbBrandFacebook,
        color: "blue",
        canCreateClient: true,
    },
    {
        id: "x",
        name: "X",
        icon: TbBrandX,
        color: "dark",
        canCreateClient: true,
    },
    {
        id: "github",
        name: "GitHub",
        icon: TbBrandGithub,
        color: "gray",
        built: true,
        dashboardName: "GitHub Developer Settings",
        scopesListUrl: "https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps",
        scopesList: [
            "repo",
            "admin:repo_hook",
            "admin:org",
            "admin:public_key",
            "admin:org_hook",
            "gist",
            "notifications",
            "user",
            "project",
            "delete_repo",
            "write:packages",
            "read:packages",
            "delete:packages",
            "admin:gpg_key",
            "codespace",
            "workflow",
        ],
        canCreateClient: true,
    },
    {
        id: "stripe",
        name: "Stripe",
        icon: TbBrandStripe,
        color: "violet",
        canCreateClient: true,
    },
    {
        id: "azure",
        name: "Azure",
        icon: TbBrandAzure,
        color: "blue",
        canCreateClient: true,
    },
    {
        id: "slack",
        name: "Slack",
        icon: TbBrandSlack,
        color: "violet",
        canCreateClient: true,
    },
    {
        id: "trello",
        name: "Trello",
        icon: TbBrandTrello,
        color: "blue",
        canCreateClient: true,
    },
    {
        id: "asana",
        name: "Asana",
        icon: TbBrandAsana,
        color: "orange",
        canCreateClient: true,
    },
    {
        id: "gitlab",
        name: "GitLab",
        icon: TbBrandGitlab,
        color: "orange",
        canCreateClient: true,
    },
    {
        id: "bitbucket",
        name: "Bitbucket",
        icon: TbBrandBitbucket,
        color: "blue",
        canCreateClient: true,
    },
    {
        id: "zoom",
        name: "Zoom",
        icon: TbBrandZoom,
        color: "blue",
        canCreateClient: true,
    },
]