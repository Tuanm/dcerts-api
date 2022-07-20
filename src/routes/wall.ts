import { Router } from 'express';
import { groupsOfMember, membersOfGroup } from '../services/db/groups';
import { getAccountFromRequest } from '../utils/auth';

const router = Router();

router.get('/me', async (req, res) => {
    const accountId = getAccountFromRequest(req);
    const groups = await groupsOfMember(accountId);
    res.json({
        id: accountId,
        data: groups,
    });
});

router.get('/groups/:member', async (req, res) => {
    const member = req.params.member;
    const groups = await groupsOfMember(member);
    res.json({
        id: member,
        data: groups,
    });
});

router.get('/members/:group', async (req, res) => {
    const group = req.params.group;
    const members = await membersOfGroup(group);
    res.json({
        id: group,
        data: members,
    });
});

export default router;